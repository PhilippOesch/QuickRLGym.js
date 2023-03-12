import {
    Environment,
    GameStateContext,
    FileStrategy,
    Utils,
} from '../../index';
import seedrandom from 'seedrandom';
import PersistableAgent from '../../RLInterface/PersistableAgent';
import { Experience } from '../../index';

export interface MCAgentSettings {
    epsilonStart: number;
    discountFactor: number;
    epsilonEnd?: number;
    epsilonDecaySteps?: number;
}

// interface ExperienceEntry {
//     state: number[];
//     actionIdx: number;
//     reward: number;
//}

interface MCSaveFormat {
    valueTable: Utils.JSONTensor;
    stateReturnCountTable: Utils.JSONTensor;
}

/**
 * Implementation of First visit Monte Carlo
 */
export default class MCAgent extends PersistableAgent {
    private _config?: MCAgentSettings;
    private rng: seedrandom.PRNG;
    private randomSeed?: string;
    private _valueTable: Utils.Tensor;
    private _stateReturnCountTable: Utils.Tensor;
    private experience: Experience[] = [];

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

    get config(): object | undefined {
        return this._config;
    }

    get valueTable(): Utils.Tensor {
        return this._valueTable;
    }

    get stateReturnCountTable(): Utils.Tensor {
        return this._stateReturnCountTable;
    }

    init(): void {
        const valueTableDims: number[] = [...this.env.stateDim];
        valueTableDims.push(this.env.actionSpace.length);
        this._valueTable = Utils.Tensor.Zeros(valueTableDims);
        this._stateReturnCountTable = Utils.Tensor.Zeros(valueTableDims);
        this.setConfig(this._config);
    }

    public setConfig(config?: MCAgentSettings, randomSeed?: number): void {
        if (randomSeed != undefined) this.setRandomSeed(randomSeed);
        if (config != undefined) {
            this._config = config;
            this.epsilon = this._config.epsilonStart;
        }
        this.epsilonStep = 0;
    }

    step(state: object): string {
        return this.followEpsGreedyPolicy(state);
    }
    async feed(
        prevState: object,
        takenAction: string,
        newState: object,
        payoff: number,
        gameStateContext: GameStateContext
    ): Promise<void> {
        // buffer experience
        this.experience.push({
            prevState: this.env.encodeStateToIndices(prevState),
            takenAction: this.env.actionSpace.indexOf(takenAction),
            newState: this.env.encodeStateToIndices(newState),
            payoff: payoff,
            contextInfo: gameStateContext,
        });
        if (gameStateContext.isTerminal) {
            // use experience for training and then reset experience
            this.mcTrainingStep();
        }
        if (
            gameStateContext.maxIterationReached ||
            gameStateContext.isTerminal
        ) {
            //empty experience
            this.experience = [];
        }
    }

    public decayEpsilon(): void {
        if (!this._config!.epsilonDecaySteps || !this._config!.epsilonEnd) {
            return;
        }

        if (this.epsilonStep < this._config!.epsilonDecaySteps) {
            this.epsilonStep++;
            this.epsilon =
                this._config!.epsilonStart -
                ((this._config!.epsilonStart - this._config!.epsilonEnd) /
                    this._config!.epsilonDecaySteps) *
                    this.epsilonStep;
        }
    }

    evalStep(state: object): string {
        const actions: number[] = this.getStateActionValues(state);
        const actionIdx: number = Utils.MathUtils.argMax(actions);
        return this.env.actionSpace[actionIdx];
    }

    log(): void {
        console.log('epsilon:', this.epsilon);
        console.log('epsilonStep', this.epsilonStep);
    }

    /**
     * Set the random Seed for the agent
     * @param randomSeed - the random seed
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
        for (let i = this.experience.length - 1; i >= 0; i--) {
            const idxExperience: Experience = this.experience[i];
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
        fileManager: FileStrategy,
        options?: object
    ): Promise<void> {
        const loadObject: MCSaveFormat = (await fileManager.load(
            options
        )) as MCSaveFormat;
        this._valueTable = Utils.Tensor.fromJSONObject(loadObject.valueTable);
        this._stateReturnCountTable = Utils.Tensor.fromJSONObject(
            loadObject.stateReturnCountTable
        );
    }

    public async save(
        fileManager: FileStrategy,
        options?: object
    ): Promise<void> {
        await fileManager.save(
            {
                valueTable: this._valueTable.toJSONTensor(),
                stateReturnCountTable:
                    this._stateReturnCountTable.toJSONTensor(),
            },
            options
        );
    }

    async loadConfig(
        fileManager: FileStrategy,
        options?: object
    ): Promise<void> {
        const loadObject: MCAgentSettings = <MCAgentSettings>(
            await fileManager.load(options)
        );
        this.setConfig(loadObject);
    }
    async saveConfig(
        fileManager: FileStrategy,
        options?: object
    ): Promise<void> {
        await fileManager.save(this._config!, options);
    }
}
