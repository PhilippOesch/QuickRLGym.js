import seedrandom from 'seedrandom';
import {
    MathUtils,
    Tensor,
    SingleAgentEnvironment,
    Agent,
    FileManager,
    JSONTensor,
} from '../../index';

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
export default class QLAgent extends Agent {
    private config?: QLAgentSettings;
    private rng: seedrandom.PRNG;
    private randomSeed?: string;
    private qTable: Tensor;
    private epsilon: number;
    private epsilonStep: number;

    constructor(
        env: SingleAgentEnvironment,
        config?: QLAgentSettings,
        randomSeed?: number
    ) {
        super(env);
        this.setRandomSeed(randomSeed);
        this.env = env;
        this.config = config;
    }

    public setOptions(config: QLAgentSettings, randomSeed?: number): void {
        this.setRandomSeed(randomSeed);
        this.config = config;
    }

    public get getQTable(): Tensor {
        return this.qTable;
    }

    init(): void {
        const qTableDims: number[] = [...this.env.getGameStateDim];
        qTableDims.push(this.env.getActionSpace.length);
        this.qTable = Tensor.Zeros(...qTableDims);
        if (this.config) {
            this.epsilon = this.config.epsilonStart;
        }
        this.epsilonStep = 1;
    }

    step(state: object): string {
        const randNum: number = this.rng();
        if (!this.config) {
            throw new Error('The Agent has not been configured for training');
        }
        this.decayEpsilon();
        if (randNum < this.epsilon) {
            const randIdx = Math.floor(
                this.rng() * this.env.getActionSpace.length
            );
            return this.env.getActionSpace[randIdx];
        } else {
            return this.evalStep(state);
        }
    }

    log(): void {
        return;
    }

    evalStep(state: object): string {
        const actions: number[] = this.getStateActionValues(state);
        const actionIdx: number = MathUtils.argMax(actions);
        return this.env.getActionSpace[actionIdx];
    }
    feed(
        prevState: object,
        takenAction: string,
        newState: object,
        payoff: number
    ): void {
        //lookups
        const takenActionIdx = this.env.getActionSpace.indexOf(takenAction);
        const prevActionQvalues = this.getStateActionValues(prevState);
        const newPossibleActionValues = this.getStateActionValues(newState);
        const newBestActionIdx: number = MathUtils.argMax(
            newPossibleActionValues
        );

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
    public async save(
        pathString: string,
        fileManager: FileManager
    ): Promise<void> {
        await fileManager.save(pathString, this.qTable);
    }

    /**
     * load q-table from file
     * @param pathString - path to load the qtable from
     * @param fileManager - use of dependency infection to allow for different filemanagement implementations
     */
    public async load(
        pathString: string,
        fileManager: FileManager
    ): Promise<void> {
        const loadObject: object = await fileManager.load(pathString);
        this.qTable = Tensor.fromLoadObject(loadObject as JSONTensor);
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
}
