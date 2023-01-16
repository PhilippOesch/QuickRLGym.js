import seedrandom from 'seedrandom';
import Agent from '../../RLInterface/Agent';
import SingleAgentEnvironment, {
    GameStateContext,
} from '../../RLInterface/SingleAgentEnvironment';
import * as tf from '@tensorflow/tfjs';
import { MathUtils } from '../../Utils';

interface Experience {
    prevState: number[];
    takenAction: number;
    newState: number[];
    payoff: number;
    contextInfo: GameStateContext;
}

export interface DQNAgentSettings {
    learningRate: number;
    discountFactor: number;
    nnLayer: number[];
    replayMemorySize: number;
    batchSize: number;
    replayMemoryInitSize: number;
    epsilonStart: number;
    epsilonEnd: number;
    epsilonDecaySteps: number;
    hiddenLayerActivation?: string;
}

export default class DQNAgent extends Agent {
    private config?: DQNAgentSettings;
    private rng: seedrandom.PRNG;
    private experienceReplay: ReplayMemory;
    private randomSeed?: string;
    private qNetwork: tf.Sequential;
    private epsilon: number;
    private epsilonStep: number = 0;

    constructor(
        env: SingleAgentEnvironment,
        config?: DQNAgentSettings,
        randomSeed?: number
    ) {
        super(env);
        this.setRandomSeed(randomSeed);
        this.config = config;
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

    public setOptions(config: DQNAgentSettings, randomSeed?: number): void {
        this.setRandomSeed(randomSeed);
        this.config = config;
    }

    init(): void {
        if (this.config) {
            this.experienceReplay = new ReplayMemory(
                this.config.replayMemorySize
            );
        }
        this.qNetwork = this.createNetwork();
        if (this.config) {
            this.epsilon = this.config.epsilonStart;
        }
    }
    step(state: object): string {
        return this.followEpsGreedyPolicy(state);
    }
    async feed(
        prevState: object,
        takenAction: string,
        newState: object,
        payoff: number,
        contextInfo: GameStateContext
    ): Promise<void> {
        this.experienceReplay.save(
            this.toExperience(
                prevState,
                takenAction,
                newState,
                payoff,
                contextInfo
            )
        );
        if (
            this.experienceReplay.getSize >= this.config!.replayMemoryInitSize
        ) {
            //console.log('size', this.experienceReplay.getSize);
            await this.train();
        }

        if (contextInfo.isTerminal || contextInfo.maxIterationReached) {
            this.decayEpsilon();
        }
    }
    evalStep(state: object): string {
        const encodedState: tf.Tensor<tf.Rank> = tf.tensor(
            this.env.encodeStateToIndices(state),
            [1, this.env.stateDim.length]
        );
        const result: tf.Tensor<tf.Rank> = this.qNetwork.predict(
            encodedState
        ) as tf.Tensor<tf.Rank>;
        const qValues = result.arraySync() as number[][];
        const actionIdx = MathUtils.argMax(qValues[0]);
        return this.env.actionSpace[actionIdx];
    }
    log(): void {
        console.log('epsilon', this.epsilon);
    }

    createNetwork(): tf.Sequential {
        const model = tf.sequential();

        const hiddenLayerAct = this.config?.hiddenLayerActivation
            ? this.config?.hiddenLayerActivation
            : 'relu';
        // hidden layer
        model.add(
            tf.layers.dense({
                inputShape: [this.env.stateDim.length],
                activation: hiddenLayerAct as any,
                units: this.config!.nnLayer[0],
                useBias: true,
            })
        );
        for (let i = 1; i < this.config!.nnLayer.length; i++) {
            model.add(
                tf.layers.dense({
                    units: this.config!.nnLayer[i],
                    activation: hiddenLayerAct as any,
                    useBias: true,
                })
            );
        }

        // output layer
        model.add(
            tf.layers.dense({
                units: this.env.actionSpace.length,
                activation: 'linear',
            })
        );

        const adamOptimizer = tf.train.adam(this.config!.learningRate);
        const rmspropOptimizer = tf.train.rmsprop(this.config!.learningRate);

        model.compile({
            optimizer: adamOptimizer,
            loss: 'meanSquaredError',
            metrics: ['accuracy'],
        });
        model.summary();

        return model;
    }

    public decayEpsilon(): void {
        //console.log('decay');
        if (!this.config!.epsilonDecaySteps || !this.config!.epsilonEnd) {
            return;
        }
        //console.log('goOn');
        if (this.epsilonStep < this.config!.epsilonDecaySteps) {
            this.epsilonStep++;
            this.epsilon =
                this.config!.epsilonStart -
                ((this.config!.epsilonStart - this.config!.epsilonEnd) /
                    this.config!.epsilonDecaySteps) *
                    this.epsilonStep;
        }
    }

    private async train(): Promise<void> {
        const miniBatch: BatchSample = this.experienceReplay.sample(
            this.config!.batchSize,
            this.rng
        );
        //console.log(miniBatch);

        //get target prediction
        let target: number[][] = (
            this.qNetwork.predict(
                tf.tensor(miniBatch.stateBatch)
            ) as tf.Tensor<tf.Rank>
        ).arraySync() as number[][];

        // get nextStateTarget prediction
        let targetNext: number[][] = (
            this.qNetwork.predict(
                tf.tensor(miniBatch.newStateBatch)
            ) as tf.Tensor<tf.Rank>
        ).arraySync() as number[][];

        // update target according to algorithm
        for (let i = 0; i < this.config!.batchSize; i++) {
            if (miniBatch.contextInfoBatch[i].isTerminal) {
                target[i][miniBatch.actionBatch[i]] = miniBatch.payoffBatch[i];
            } else {
                const argMaxQ = Math.max(...targetNext[i]);
                target[i][miniBatch.actionBatch[i]] =
                    miniBatch.payoffBatch[i] +
                    this.config!.discountFactor * argMaxQ;
            }
        }

        let targetTensor = tf.tensor(target, [
            this.config!.batchSize,
            this.env.actionSpace.length,
        ]);
        //targetTensor.print();
        let stateTensor = tf.tensor(miniBatch.stateBatch, [
            this.config!.batchSize,
            this.env.stateDim.length,
        ]);
        //stateTensor.print();
        //targetTensor.print();
        const loss = await this.qNetwork.fit(stateTensor, targetTensor, {
            batchSize: this.config!.batchSize,
            verbose: 0,
        });
        //console.log('loss', loss);
    }

    private toExperience(
        prevState: object,
        takenAction: string,
        newState: object,
        payoff: number,
        contextInfo: GameStateContext
    ): Experience {
        return {
            prevState: this.env.encodeStateToIndices(prevState),
            takenAction: this.env.actionSpace.indexOf(takenAction),
            newState: this.env.encodeStateToIndices(newState),
            payoff: payoff,
            contextInfo: contextInfo,
        };
    }

    private sampleRandomAction(): string {
        const randIdx = Math.floor(this.rng() * this.env.actionSpace.length);
        return this.env.actionSpace[randIdx];
    }

    private followEpsGreedyPolicy(state: object): string {
        const randNum: number = this.rng();
        if (randNum < this.epsilon) {
            return this.sampleRandomAction();
        } else {
            return this.evalStep(state);
        }
    }
}

interface BatchSample {
    stateBatch: number[][];
    actionBatch: number[];
    newStateBatch: number[][];
    payoffBatch: number[];
    contextInfoBatch: GameStateContext[];
}

class ReplayMemory {
    private memory: Experience[];
    private size: number;

    constructor(size: number) {
        this.memory = [];
        this.size = size;
    }

    public get getSize(): number {
        return this.memory.length;
    }

    public sample(batchSize: number, rng?: seedrandom.PRNG): BatchSample {
        let samples: Experience[] = MathUtils.sampleN(
            this.memory,
            batchSize,
            rng
        );
        // console.log('memory', this.memory[0]);
        // console.log('samples', samples[0]);
        return this.toBatch(samples);
    }

    private toBatch(experiences: Experience[]): BatchSample {
        let stateBatch = new Array<number[]>(experiences.length);
        let takenActionBatch = new Array<number>(experiences.length);
        let newStateBatch = new Array<number[]>(experiences.length);
        let payoffBatch = new Array<number>(experiences.length);
        let contextInfoBatch = new Array<GameStateContext>(experiences.length);

        for (let i = 0; i < experiences.length; i++) {
            stateBatch[i] = experiences[i].prevState;
            takenActionBatch[i] = experiences[i].takenAction;
            newStateBatch[i] = experiences[i].newState;
            payoffBatch[i] = experiences[i].payoff;
            contextInfoBatch[i] = experiences[i].contextInfo;
        }
        return {
            stateBatch: stateBatch,
            actionBatch: takenActionBatch,
            newStateBatch: newStateBatch,
            payoffBatch: payoffBatch,
            contextInfoBatch: contextInfoBatch,
        };
    }

    public save(experience: Experience) {
        const newLength: number = this.memory.push(experience);
        if (newLength > this.size) {
            this.memory.shift();
        }
    }
}
