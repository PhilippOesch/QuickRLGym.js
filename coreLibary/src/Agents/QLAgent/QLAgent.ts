import seedrandom from 'seedrandom';
import {
    Utils,
    SingleAgentEnvironment,
    Agent,
    FileManager,
    GameStateContext,
} from '../../index';
import PersistentAgent from '../../RLInterface/PersistentAgent';

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
export default class QLAgent extends PersistentAgent {
    private config?: QLAgentSettings;
    private rng: seedrandom.PRNG;
    private randomSeed?: string;
    private qTable: Utils.Tensor;
    private epsilon: number;
    private epsilonStep: number;

    constructor(
        env: SingleAgentEnvironment,
        config?: QLAgentSettings,
        randomSeed?: number
    ) {
        super(env);
        this.setRandomSeed(randomSeed);
        this.config = config;
    }

    public setConfig(config?: QLAgentSettings, randomSeed?: number): void {
        if (randomSeed != undefined) this.setRandomSeed(randomSeed);
        if (config != undefined) {
            this.config = config;
            this.epsilon = this.config!.epsilonStart;
            this.epsilonStep = 0;
        }
    }

    public get getQTable(): Utils.Tensor {
        return this.qTable;
    }

    init(): void {
        const qTableDims: number[] = [...this.env.stateDim];
        qTableDims.push(this.env.actionSpace.length);
        this.qTable = Utils.Tensor.Zeros(qTableDims);
        if (this.config) {
            this.epsilon = this.config.epsilonStart;
        }
        this.epsilonStep = 1;
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
            this.config!.learningRate *
                (payoff +
                    this.config!.discountFactor *
                        (newPossibleActionValues[newBestActionIdx] -
                            prevActionQvalues[takenActionIdx]));

        // update qValue

        this.qTable.set(
            [...this.env.encodeStateToIndices(prevState), takenActionIdx],
            newQValue
        );
    }

    public decayEpsilon(): void {
        if (!this.config!.epsilonDecaySteps || !this.config!.epsilonEnd) {
            return;
        }

        if (this.epsilonStep < this.config!.epsilonDecaySteps) {
            this.epsilonStep++;
            this.epsilon =
                this.config!.epsilonStart -
                ((this.config!.epsilonStart - this.config!.epsilonEnd) /
                    this.config!.epsilonDecaySteps) *
                    this.epsilonStep;
        }
    }

    public printQTable() {
        console.log('QTable', this.qTable);
    }

    private getStateActionValues(state: object): number[] {
        const indices: number[] = this.env.encodeStateToIndices(state);
        return this.qTable.get(...indices) as number[];
    }

    /**
     * Save the q-table to file
     * @param pathString - path to save the qtable to
     * @param fileManager - use of dependency infection to allow for different filemanagement implementations
     */
    public async save(fileManager: FileManager, path?: string): Promise<void> {
        await fileManager.save(this.qTable, path);
    }

    /**
     * load q-table from file
     * @param pathString - path to load the qtable from
     * @param fileManager - use of dependency infection to allow for different filemanagement implementations
     */
    public async load(fileManager: FileManager, path?: string): Promise<void> {
        const loadObject: object = await fileManager.load(path);
        this.qTable = Utils.Tensor.fromJSONObject(
            loadObject as Utils.JSONTensor
        );
    }

    async loadConfig(
        fileManager: FileManager,
        path?: string | undefined
    ): Promise<void> {
        const loadObject: QLAgentSettings = <QLAgentSettings>(
            await fileManager.load(path)
        );
        this.setConfig(loadObject);
    }
    async saveConfig(
        fileManager: FileManager,
        path?: string | undefined
    ): Promise<void> {
        await fileManager.save(this.config!, path);
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
