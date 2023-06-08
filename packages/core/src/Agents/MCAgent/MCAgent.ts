import seedrandom from 'seedrandom';
import PersistableAgent from '../../RLInterface/PersistableAgent';
import { General, JSONTensor, MathUtils, Tensor } from '../../Utils';
import {
    EnvStateContext,
    Experience,
} from '../../RLInterface/SingleAgentEnvironment';
import Environment from '../../RLInterface/Environment';
import * as FileStrategies from '../../RLInterface/FileStrategy';

/**
 * Settings for the MCAgent
 * @category Agents
 * @subcategory MCAgent
 * @property {number} epsilonStart the epsilon start
 * @property {number} discountFactor the discount factor
 * @property {?number} epsilonEnd the epsilon end
 * @property {?number} epsilonDecaySteps the epsilon decay steps
 */
export interface MCAgentSettings {
    epsilonStart: number;
    discountFactor: number;
    epsilonEnd?: number;
    epsilonDecaySteps?: number;
}

/**
 * The Monte Carlo Save format
 * @category Agents
 * @subcategory MCAgent
 * @property {JSONTensor} valueTable the value table
 * @property {JSONTensor} stateReturnCountTable the state return count table
 */
export interface MCSaveFormat {
    valueTable: JSONTensor;
    stateReturnCountTable: JSONTensor;
}

/**
 * Implementation of First visit Monte Carlo
 * @category Agents
 * @extends PersistableAgent
 * @param {Environment} env The environment
 * @param {?MCAgentSettings} config The configuration
 * @param {?number} randomSeed the random seed
 */
class MCAgent extends PersistableAgent<MCSaveFormat, MCAgentSettings> {
    private _config?: MCAgentSettings;
    private rng: seedrandom.PRNG;
    private randomSeed?: string;
    private _valueTable: Tensor;
    private _stateReturnCountTable: Tensor;
    private _experience: Experience[] = [];

    private epsilon: number = 0;
    private epsilonStep: number = 0;

    constructor(
        env: Environment,
        config?: MCAgentSettings,
        randomSeed?: number
    ) {
        super(env);
        this.setRandomSeed(randomSeed);
        this._config = config;
    }

    public get config(): object | undefined {
        return this._config;
    }

    /**
     * Get the value table
     * @type {Tensor}
     */
    public get valueTable(): Tensor {
        return this._valueTable;
    }

    /**
     * Get the state retunn count table
     * @type {Tensor}
     */
    public get stateReturnCountTable(): Tensor {
        return this._stateReturnCountTable;
    }

    /**
     * Get a shallow copy of experiences
     * @type {Experience[]}
     */
    public get experience(): Experience[] {
        return this._experience.map((entry) => Object.assign({}, entry));
    }

    public get trainingInitialized(): boolean {
        return (
            this._valueTable !== undefined &&
            this._stateReturnCountTable !== undefined &&
            this._config !== undefined
        );
    }

    public init(): void {
        if (!this.trainingInitialized) {
            this.reset();
        }
    }

    public reset(): void {
        const valueTableDims: number[] = [...this.env.stateDim];
        valueTableDims.push(this.env.actionSpace.length);
        this._valueTable = Tensor.Zeros(valueTableDims);
        this._stateReturnCountTable = Tensor.Zeros(valueTableDims);
        this.setConfig(this._config);
    }

    /**
     * Set The configuration of the agent after initailizing.
     * @param {?MCAgentSettings} config The configuration
     * @param {?randomSeed} randomSeed The random seed
     */
    public setConfig(config?: MCAgentSettings, randomSeed?: number): void {
        if (randomSeed != undefined) this.setRandomSeed(randomSeed);
        if (config != undefined) {
            this._config = config;
            this.epsilon = this._config.epsilonStart;
        }
        this.epsilonStep = 0;
    }

    public step(state: object): string {
        return this.followEpsGreedyPolicy(state);
    }

    public async feed(
        prevState: object,
        takenAction: string,
        newState: object,
        payoff: number,
        envStateContext: EnvStateContext
    ): Promise<void> {
        // buffer experience
        this._experience.push({
            prevState: this.env.encodeStateToIndices(prevState),
            takenAction: this.env.actionSpace.indexOf(takenAction),
            newState: this.env.encodeStateToIndices(newState),
            payoff: payoff,
            contextInfo: envStateContext,
        });
        if (envStateContext.isTerminal) {
            // use experience for training and then reset experience
            this.mcTrainingStep();
        }
        if (envStateContext.maxIterationReached || envStateContext.isTerminal) {
            //empty experience
            this._experience = [];
        }
    }

    /**
     * Decay the epsilon value
     * @returns {void}
     */
    public decayEpsilon(): void {
        if (!this._config!.epsilonDecaySteps || !this._config!.epsilonEnd) {
            return;
        }

        const { epsilon, stepCount } = General.linearDecayEpsilon(
            this.epsilonStep,
            this._config!.epsilonDecaySteps,
            this._config!.epsilonStart,
            this._config!.epsilonEnd
        );

        this.epsilon = epsilon;
        this.epsilonStep = stepCount;
    }

    public evalStep(state: object): string {
        const actions: number[] = this.getStateActionValues(state);
        const actionIdx: number = MathUtils.argMax(actions);
        return this.env.actionSpace[actionIdx];
    }

    public log(): void {
        console.log('epsilon:', this.epsilon);
        console.log('epsilonStep', this.epsilonStep);
    }

    /**
     * Set the random Seed for the agent
     * @param {?number} randomSeed - the random seed
     */
    private setRandomSeed(randomSeed?: number) {
        if (randomSeed != undefined) {
            this.randomSeed = randomSeed.toString();
            this.rng = seedrandom(this.randomSeed);
        } else {
            this.rng = seedrandom();
        }
    }

    private mcTrainingStep() {
        let g: number = 0;
        let visitedExperiences: Experience[] = [];
        this.decayEpsilon();
        for (let i = this._experience.length - 1; i >= 0; i--) {
            const idxExperience: Experience = this._experience[i];
            g = g * this._config!.discountFactor + idxExperience.payoff;
            const alreadyVisited: boolean = this.stateAlreadyVisited(
                idxExperience.prevState,
                visitedExperiences
            );
            if (!alreadyVisited) {
                this.onAlreadyVisited(visitedExperiences, idxExperience, g);
            }
        }
    }

    private onAlreadyVisited(
        visitedExperiences: Experience[],
        idxExperience: Experience,
        g: number
    ) {
        visitedExperiences.push(idxExperience);
        let stateReturnCount: number = this._stateReturnCountTable.get(
            ...idxExperience.prevState,
            idxExperience.takenAction
        ) as number;
        stateReturnCount++;
        this._stateReturnCountTable.set(
            [...idxExperience.prevState, idxExperience.takenAction],
            stateReturnCount
        );
        const oldMean: number = this._valueTable.get(
            ...idxExperience.prevState,
            idxExperience.takenAction
        ) as number;
        const newMean =
            (oldMean / stateReturnCount) * (stateReturnCount - 1) +
            g / stateReturnCount;
        this._valueTable.set(
            [...idxExperience.prevState, idxExperience.takenAction],
            newMean
        );
    }

    private stateAlreadyVisited(
        state: number[],
        visitedExperiences: Experience[]
    ): boolean {
        const found = visitedExperiences.find((entry: Experience) => {
            return entry.prevState.every((val, idx) => val === state[idx]);
        });
        if (found !== undefined) return true;
        return false;
    }

    private getStateActionValues(state: object): number[] {
        const indices: number[] = this.env.encodeStateToIndices(state);
        return this._valueTable.get(...indices) as number[];
    }

    private followEpsGreedyPolicy(state: object): string {
        const randNum: number = this.rng();
        if (randNum < this.epsilon) {
            return this.sampleRandomAction();
        } else {
            return this.evalStep(state);
        }
    }

    private sampleRandomAction() {
        const randIdx = Math.floor(this.rng() * this.env.actionSpace.length);
        return this.env.actionSpace[randIdx];
    }

    public async load(
        fileManager: FileStrategies.JSONLoader<MCSaveFormat>
    ): Promise<void> {
        const loadObject: MCSaveFormat = await fileManager.load();
        this._valueTable = Tensor.fromJSONObject(loadObject.valueTable);
        this._stateReturnCountTable = Tensor.fromJSONObject(
            loadObject.stateReturnCountTable
        );
    }

    public async save(
        fileManager: FileStrategies.JSONSaver<MCSaveFormat>,
        options?: object
    ): Promise<void> {
        await fileManager.save({
            valueTable: this._valueTable.toJSONTensor(),
            stateReturnCountTable: this._stateReturnCountTable.toJSONTensor(),
        });
    }

    public async loadConfig(
        fileManager: FileStrategies.JSONLoader<MCAgentSettings>,
        options?: object
    ): Promise<void> {
        const loadObject: MCAgentSettings = await fileManager.load();
        this.setConfig(loadObject);
    }
    public async saveConfig(
        fileManager: FileStrategies.JSONSaver<MCAgentSettings>,
        options?: object
    ): Promise<void> {
        await fileManager.save(this._config!);
    }
}

export default MCAgent;
