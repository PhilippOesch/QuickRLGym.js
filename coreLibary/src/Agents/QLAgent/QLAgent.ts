import seedrandom from 'seedrandom';
import {
    Utils,
    SingleAgentEnvironment,
    FileStrategy,
    GameStateContext,
} from '../../index';
import PersistableAgent from '../../RLInterface/PersistableAgent';
import { General } from '../../Utils';

/**
 * Settings for the QLAgent
 */
export interface QLAgentSettings {
    learningRate: number;
    discountFactor: number;
    epsilonStart: number;
    epsilonEnd: number;
    epsilonDecaySteps: number;
}

/**
 * Agent that represents a Q-Learning Algorithm
 */
export default class QLAgent extends PersistableAgent {
    private _config?: QLAgentSettings;
    private rng: seedrandom.PRNG;
    private randomSeed?: string;
    private _qTable: Utils.Tensor;
    private epsilon: number;
    private epsilonStep: number;

    constructor(
        env: SingleAgentEnvironment,
        config?: QLAgentSettings,
        randomSeed?: number
    ) {
        super(env);
        this.setRandomSeed(randomSeed);
        this._config = config;
    }

    get config(): object | undefined {
        return this._config;
    }

    public setConfig(config?: QLAgentSettings, randomSeed?: number): void {
        if (randomSeed != undefined) this.setRandomSeed(randomSeed);
        if (config != undefined) {
            this._config = config;
            this.epsilon = this._config.epsilonStart;
        }
        this.epsilonStep = 0;
    }

    public get qTable(): Utils.Tensor {
        return this._qTable;
    }

    init(): void {
        const qTableDims: number[] = [...this.env.stateDim];
        qTableDims.push(this.env.actionSpace.length);
        this._qTable = Utils.Tensor.Zeros(qTableDims);
        this.setConfig(this._config);
    }

    step(state: object): string {
        return this.followEpsGreedyPolicy(state);
    }

    log(): void {
        return;
    }

    evalStep(state: object): string {
        const actions: number[] = this.getStateActionValues(state);
        const actionIdx: number = Utils.MathUtils.argMax(actions);
        return this.env.actionSpace[actionIdx];
    }
    async feed(
        prevState: object,
        takenAction: string,
        newState: object,
        payoff: number,
        gameStateContext: GameStateContext
    ): Promise<void> {
        //lookups
        const takenActionIdx = this.env.actionSpace.indexOf(takenAction);
        const prevActionQvalues = this.getStateActionValues(prevState);
        const newPossibleActionValues = this.getStateActionValues(newState);
        const newBestActionIdx: number = Utils.MathUtils.argMax(
            newPossibleActionValues
        );

        if (gameStateContext.isTerminal || gameStateContext.maxIterationReached)
            this.decayEpsilon();

        // bellmann equation
        const newQValue: number =
            prevActionQvalues[takenActionIdx] +
            this._config!.learningRate *
                (payoff +
                    this._config!.discountFactor *
                        (newPossibleActionValues[newBestActionIdx] -
                            prevActionQvalues[takenActionIdx]));

        // update qValue

        this._qTable.set(
            [...this.env.encodeStateToIndices(prevState), takenActionIdx],
            newQValue
        );
    }

    public decayEpsilon(): void {
        if (!this._config!.epsilonDecaySteps || !this._config!.epsilonEnd) {
            return;
        }

        const { epsilon, stepCount } = General.decayEpsilon(
            this.epsilonStep,
            this._config!.epsilonDecaySteps,
            this._config!.epsilonStart,
            this._config!.epsilonEnd
        );

        this.epsilon = epsilon;
        this.epsilonStep = stepCount;
    }

    public printQTable() {
        console.log('QTable', this._qTable);
    }

    private getStateActionValues(state: object): number[] {
        const indices: number[] = this.env.encodeStateToIndices(state);
        return this._qTable.get(...indices) as number[];
    }

    /**
     * Save the q-table to file
     * @param fileStrategy - the file strategy for saving
     * @param options - the options for the file strategy
     */
    public async save(
        fileStrategy: FileStrategy,
        options?: object
    ): Promise<void> {
        await fileStrategy.save(this._qTable.toJSONTensor(), options);
    }

    /**
     * load q-table from file
     * @param fileStrategy - the file strategy for loading
     * @param options - the options for the file strategy
     */
    public async load(
        fileStrategy: FileStrategy,
        options?: object
    ): Promise<void> {
        const loadObject: object = await fileStrategy.load(options);
        this._qTable = Utils.Tensor.fromJSONObject(
            <Utils.JSONTensor>loadObject
        );
    }

    async loadConfig(
        fileManager: FileStrategy,
        options?: object
    ): Promise<void> {
        const loadObject: QLAgentSettings = <QLAgentSettings>(
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

    private followEpsGreedyPolicy(state: object): string {
        const randNum: number = this.rng();
        if (randNum < this.epsilon) {
            return this.sampleRandomAction();
        } else {
            return this.evalStep(state);
        }
    }

    private sampleRandomAction(): string {
        const randIdx = Math.floor(this.rng() * this.env.actionSpace.length);
        return this.env.actionSpace[randIdx];
    }
}
