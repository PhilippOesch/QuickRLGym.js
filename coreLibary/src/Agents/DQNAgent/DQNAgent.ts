import seedrandom from 'seedrandom';
import SingleAgentEnvironment, {
    GameStateContext,
} from '../../RLInterface/SingleAgentEnvironment';
import * as tf from '@tensorflow/tfjs';
import { MathUtils } from '../../Utils';
import PersistentAgent from '../../RLInterface/PersistentAgent';
import FileStrategy from '../../RLInterface/FileStrategy';

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
    activateDoubleDQN?: boolean;
    updateTargetEvery?: number;
    hiddenLayerActivation?: string;
    layerNorm?: boolean;
}

export default class DQNAgent extends PersistentAgent {
    private config?: DQNAgentSettings;
    private rng: seedrandom.PRNG;
    private experienceReplay: ReplayMemory;
    private randomSeed?: string;
    private qNetworkLocal: tf.Sequential;
    private qNetworkTarget: tf.Sequential;
    private epsilon: number;
    private epsilonStep: number = 0;
    private timeStep: number = 0;
    private loss: any;

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

    public setConfig(config: DQNAgentSettings, randomSeed?: number): void {
        if (randomSeed != undefined) this.setRandomSeed(randomSeed);
        if (config != undefined) {
            this.config = config;
            this.epsilon = this.config!.epsilonStart;
        }
        this.epsilonStep = 0;
    }

    init(): void {
        if (this.config) {
            this.experienceReplay = new ReplayMemory(
                this.config.replayMemorySize
            );
        }
        // create local qNetwork
        this.qNetworkLocal = this.createNetwork();
        if (this.config) {
            this.epsilon = this.config.epsilonStart;

            // when active create target network for DDQN
            if (this.config.activateDoubleDQN)
                this.qNetworkTarget = this.createNetwork();
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
        // wait untily replay memory is large enougth
        if (this.replayMemoryLargeEnougth()) {
            await this.train();
        }

        if (contextInfo.isTerminal || contextInfo.maxIterationReached) {
            this.decayEpsilon();
        }
    }
    private replayMemoryLargeEnougth() {
        return (
            this.experienceReplay.getSize >= this.config!.replayMemoryInitSize
        );
    }

    evalStep(state: object): string {
        const encodedState: tf.Tensor<tf.Rank> = tf.tensor(
            this.env.encodeStateToIndices(state),
            [1, this.env.stateDim.length]
        );
        const result: tf.Tensor<tf.Rank> = this.qNetworkLocal.predict(
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
                kernelInitializer: 'heUniform',
            })
        );
        if (this.config!.layerNorm) {
            model.add(
                tf.layers.layerNormalization({
                    center: true,
                    scale: true,
                })
            );
        }

        for (let i = 1; i < this.config!.nnLayer.length; i++) {
            model.add(
                tf.layers.dense({
                    units: this.config!.nnLayer[i],
                    activation: hiddenLayerAct as any,
                    kernelInitializer: 'heUniform',
                })
            );
            if (this.config!.layerNorm) {
                model.add(
                    tf.layers.layerNormalization({
                        center: true,
                        scale: true,
                    })
                );
            }
        }

        // output layer
        model.add(
            tf.layers.dense({
                units: this.env.actionSpace.length,
                activation: 'linear',
            })
        );

        const adamOptimizer = tf.train.adam(this.config!.learningRate);

        model.compile({
            optimizer: adamOptimizer,
            loss: 'meanSquaredError',
            metrics: ['accuracy'],
        });
        model.summary();

        return model;
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

    public async save(
        fileManager: FileStrategy,
        options?: object
    ): Promise<void> {
        await fileManager.save(this.qNetworkLocal, options);
    }

    async load(fileManager: FileStrategy, options?: object): Promise<void> {
        this.qNetworkLocal = <tf.Sequential>await fileManager.load(options);

        const adamOptimizer = tf.train.adam(this.config!.learningRate);

        this.qNetworkLocal.compile({
            optimizer: adamOptimizer,
            loss: 'meanSquaredError',
            metrics: ['accuracy'],
        });
        this.qNetworkLocal.summary();

        //additionally load target network when needed
        if (this.config?.activateDoubleDQN) {
            this.qNetworkTarget = <tf.Sequential>await fileManager.load();

            const adamOptimizer = tf.train.adam(this.config!.learningRate);

            this.qNetworkTarget.compile({
                optimizer: adamOptimizer,
                loss: 'meanSquaredError',
                metrics: ['accuracy'],
            });
            this.qNetworkTarget.summary();
        }
    }
    async loadConfig(
        fileManager: FileStrategy,
        options?: object
    ): Promise<void> {
        const loadObject: DQNAgentSettings = <DQNAgentSettings>(
            await fileManager.load(options)
        );
        this.setConfig(loadObject);
    }
    async saveConfig(
        fileManager: FileStrategy,
        options?: object
    ): Promise<void> {
        await fileManager.save(this.config!, options);
    }

    private async train(): Promise<void> {
        this.timeStep++;

        const miniBatch: BatchSample = this.experienceReplay.sample(
            this.config!.batchSize,
            this.rng
        );

        let targetNetwork: tf.Sequential;

        // use target network when in double DQN mode
        if (this.config!.activateDoubleDQN) {
            targetNetwork = this.qNetworkTarget;
        } else {
            targetNetwork = this.qNetworkLocal;
        }

        //get target prediction
        let target: number[][] = (
            targetNetwork.predict(
                tf.tensor(miniBatch.stateBatch)
            ) as tf.Tensor<tf.Rank>
        ).arraySync() as number[][];

        // get nextStateTarget prediction
        let targetNext: number[][] = (
            targetNetwork.predict(
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
        this.loss = await this.qNetworkLocal.fit(stateTensor, targetTensor, {
            batchSize: this.config!.batchSize,
            verbose: 0,
        });

        // update target network every "updateTargetEvery" steps
        if (
            this.config!.activateDoubleDQN &&
            this.timeStep >= this.config!.updateTargetEvery!
        ) {
            this.qNetworkTarget.setWeights(this.qNetworkLocal.getWeights());
            console.log('target weights updated');
            console.log('loss', this.loss);
            this.timeStep = 0;
        }
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
