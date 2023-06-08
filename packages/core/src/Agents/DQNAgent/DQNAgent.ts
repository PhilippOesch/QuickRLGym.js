import seedrandom from 'seedrandom';
import { Environment, EnvStateContext, Experience } from '../../index';
import tf from '@tensorflow/tfjs';
import { MathUtils, General } from '../../Utils';
import PersistableAgent from '../../RLInterface/PersistableAgent';
import FileStrategy from '../../RLInterface/FileStrategy';

/**
 * The settings of the DQN-Agent
 * @category Agents
 * @subcategory DQN
 * @property {number} learningRate The learning rate
 * @property {number} discountFactor The discount factor
 * @property {number[]} nnLayer The size of the neurlal network layer
 * @property {number} replayMemorySize The replay memory size
 * @property {number} batchSize The batch size
 * @property {number} replayMemoryInitSize The initial needed size of the replay memory
 * @property {number} epsilonStart The epsilon start value
 * @property {number} epsilonEnd The epsilon end value
 * @property {number} epsilonDecaySteps The number of epsilon decay steps
 * @property {?boolean} activateDoubleDQN Use a double DQN setup for learning (recommended)
 * @property {?number} updateTargetEvery After how many steps to synchronize the target network
 * with the local network when the double DQN is active
 * @property {?string} hiddenLayerActivation The hidden layer activation function to use. (recommended: 'relu').
 * See the  {@link https://js.tensorflow.org/api/latest/#layers.dense|tensorflow.js } documentation
 * for available activation functions.
 * @property {?boolean} layerNorm Whether to use layer normalization.
 * This slows down training but may improve training results.
 * @property {?number} kernelInitializerSeed The seed to use for kernel initialization.
 * This improved the reproducability of training results.
 */
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
    kernelInitializerSeed?: number;
}

/**
 * Interface for the DQN-Network
 * @category Agents
 * @subcategory DQN
 * @property {tf.Sequential} local The local network (see: {@link https://js.tensorflow.org/api/latest/#class:Sequential|tf.Sequential})
 * @property {?tf.Sequential} target The target network (see: {@link https://js.tensorflow.org/api/latest/#class:Sequential|tf.Sequential})
 */
export interface DQNNetwork {
    local: tf.Sequential;
    target?: tf.Sequential;
}

/**
 * Implementation of {@link https://arxiv.org/abs/1312.5602|DQN}
 * @category Agents
 * @extends PersistableAgent
 * @param {Environment} env The enviroment
 * @param {?DQNAgentSettings} config The configuration
 * @param {?number} randomSeed The configuration
 */
class DQNAgent extends PersistableAgent<tf.Sequential, DQNAgentSettings> {
    private _config?: DQNAgentSettings;
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
        env: Environment,
        config?: DQNAgentSettings,
        randomSeed?: number
    ) {
        super(env);
        this.setRandomSeed(randomSeed);
        this._config = config;
    }

    public get config(): object | undefined {
        return this._config;
    }

    private setRandomSeed(randomSeed?: number) {
        if (randomSeed !== undefined) {
            this.randomSeed = randomSeed.toString();
            this.rng = seedrandom(this.randomSeed);
        } else {
            this.rng = seedrandom();
        }
    }

    /**
     * Get the network
     * @type {DQNNetwork}
     */
    public get network(): DQNNetwork {
        return {
            local: this.qNetworkLocal,
            target: this.qNetworkTarget,
        };
    }

    /**
     * Get the ReplayMemory
     * @type {ReplayMemory}
     */
    public get replayMemory(): ReplayMemory {
        return this.experienceReplay;
    }

    /**
     * Set The configuration of the agent after initailizing.
     * @param {?DQNAgentSettings} config The configuration.
     * @param {?number} randomSeed The random seed.
     */
    public setConfig(config?: DQNAgentSettings, randomSeed?: number): void {
        if (randomSeed !== undefined) this.setRandomSeed(randomSeed);
        if (config !== undefined) {
            this._config = config;
            this.epsilon = this._config.epsilonStart;
        }
        this.epsilonStep = 0;
    }

    public get trainingInitialized(): boolean {
        return (
            this._config !== undefined &&
            this.qNetworkLocal !== undefined &&
            ((this._config.activateDoubleDQN &&
                this.qNetworkTarget !== undefined) ||
                !this._config.activateDoubleDQN)
        );
    }

    public init(): void {
        if (!this.trainingInitialized) {
            this.reset();
        }
    }

    public reset(): void {
        if (this._config) {
            this.experienceReplay = new ReplayMemory(
                this._config.replayMemorySize
            );
        }
        // create local qNetwork
        this.qNetworkLocal = this.createNetwork();
        if (this._config) {
            this.epsilon = this._config.epsilonStart;

            if (this._config.activateDoubleDQN)
                this.qNetworkTarget = this.createNetwork();
        }
    }

    public step(state: object): string {
        return this.followEpsGreedyPolicy(state);
    }
    public async feed(
        prevState: object,
        takenAction: string,
        newState: object,
        payoff: number,
        contextInfo: EnvStateContext
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
        return this.experienceReplay.size >= this._config!.replayMemoryInitSize;
    }

    public evalStep(state: object): string {
        const encodedState: tf.Tensor<tf.Rank> = tf.tensor(
            this.env.encodeStateToIndices(state),
            [1, this.env.stateDim.length]
        );
        const result: tf.Tensor<any> = this.qNetworkLocal.predict(
            encodedState
        ) as tf.Tensor<tf.Rank>;
        const qValues = result.arraySync() as number[][];
        const actionIdx = MathUtils.argMax(qValues[0]);
        return this.env.actionSpace[actionIdx];
    }
    public log(): void {
        console.log('epsilon', this.epsilon);
    }

    /**
     * Create a network
     * @returns {tf.Sequential}
     */
    public createNetwork(): tf.Sequential {
        const model = tf.sequential();

        const hiddenLayerAct = this._config?.hiddenLayerActivation
            ? this._config?.hiddenLayerActivation
            : 'relu';

        let kernelInitializer: any;
        if (this._config?.kernelInitializerSeed) {
            kernelInitializer = tf.initializers.heNormal({
                seed: this._config?.kernelInitializerSeed,
            });
        } else {
            kernelInitializer = tf.initializers.heNormal({});
        }

        // hidden layer
        model.add(
            tf.layers.dense({
                inputShape: [this.env.stateDim.length],
                activation: hiddenLayerAct as any,
                units: this._config!.nnLayer[0],
                kernelInitializer: kernelInitializer,
            })
        );
        if (this._config!.layerNorm) {
            model.add(
                tf.layers.layerNormalization({
                    center: true,
                    scale: true,
                })
            );
        }

        for (let i = 1; i < this._config!.nnLayer.length; i++) {
            model.add(
                tf.layers.dense({
                    units: this._config!.nnLayer[i],
                    activation: hiddenLayerAct as any,
                    kernelInitializer: kernelInitializer,
                })
            );
            if (this._config!.layerNorm) {
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

        const adamOptimizer = tf.train.adam(this._config!.learningRate);

        model.compile({
            optimizer: adamOptimizer,
            loss: 'meanSquaredError',
            metrics: ['accuracy'],
        });
        model.summary();

        return model;
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

    public async save(
        fileManager: FileStrategy<tf.Sequential>,
        options?: object
    ): Promise<void> {
        await fileManager.save(this.qNetworkLocal, options);
    }

    public async load(
        fileManager: FileStrategy<tf.Sequential>,
        options?: object
    ): Promise<void> {
        this.qNetworkLocal = await fileManager.load(options);

        const adamOptimizer = tf.train.adam(this._config!.learningRate);

        this.qNetworkLocal.compile({
            optimizer: adamOptimizer,
            loss: 'meanSquaredError',
            metrics: ['accuracy'],
        });
        this.qNetworkLocal.summary();

        //additionally load target network when needed
        if (this._config?.activateDoubleDQN) {
            this.qNetworkTarget = <tf.Sequential>(
                await fileManager.load(options)
            );

            const adamOptimizer = tf.train.adam(this._config.learningRate);

            this.qNetworkTarget.compile({
                optimizer: adamOptimizer,
                loss: 'meanSquaredError',
                metrics: ['accuracy'],
            });
            this.qNetworkTarget.summary();
        }
    }
    public async loadConfig(
        fileManager: FileStrategy<DQNAgentSettings>,
        options?: object
    ): Promise<void> {
        const loadObject: DQNAgentSettings = await fileManager.load(options);
        this.setConfig(loadObject);
    }
    public async saveConfig(
        fileManager: FileStrategy<DQNAgentSettings>,
        options?: object
    ): Promise<void> {
        await fileManager.save(this._config!, options);
    }

    private async train(): Promise<void> {
        this.timeStep++;

        const miniBatch: BatchSample = this.experienceReplay.sample(
            this._config!.batchSize,
            this.rng
        );

        let targetNetwork: tf.Sequential;

        // use target network when in double DQN mode
        if (this._config!.activateDoubleDQN) {
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
        for (let i = 0; i < this._config!.batchSize; i++) {
            if (miniBatch.contextInfoBatch[i].isTerminal) {
                target[i][miniBatch.actionBatch[i]] = miniBatch.payoffBatch[i];
            } else {
                const argMaxQ = Math.max(...targetNext[i]);
                target[i][miniBatch.actionBatch[i]] =
                    miniBatch.payoffBatch[i] +
                    this._config!.discountFactor * argMaxQ;
            }
        }

        let targetTensor = tf.tensor(target, [
            this._config!.batchSize,
            this.env.actionSpace.length,
        ]);
        let stateTensor = tf.tensor(miniBatch.stateBatch, [
            this._config!.batchSize,
            this.env.stateDim.length,
        ]);
        this.loss = await this.qNetworkLocal.fit(stateTensor, targetTensor, {
            batchSize: this._config!.batchSize,
            verbose: 0,
        });

        // update target network every "updateTargetEvery" steps
        if (
            this._config!.activateDoubleDQN &&
            this.timeStep >= this._config!.updateTargetEvery!
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
        contextInfo: EnvStateContext
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

/**
 * A Batch sample
 * @category Agents
 * @subcategory DQN
 * @property {number[][]} stateBatch The states batch
 * @property {number[]} actionBatch The actions batch
 * @property {number[][]} newStateBatch The new states batch
 * @property {number[]} payoffBatch The payoffs batch
 * @property {EnvStateContext[]} contextInfoBatch The environment context info batch
 * */
export interface BatchSample {
    stateBatch: number[][];
    actionBatch: number[];
    newStateBatch: number[][];
    payoffBatch: number[];
    contextInfoBatch: EnvStateContext[];
}

/**
 * The Replay Memory
 * @category Agents
 * @subcategory DQN
 * @param {number} maxSize The maximal size of the replay memory
 */
export class ReplayMemory {
    private memory: Experience[];
    private _maxSize: number;

    constructor(maxSize: number) {
        this.memory = [];
        this._maxSize = maxSize;
    }

    /**
     * Get the max size
     * @type {number}
     */
    public get maxSize(): number {
        return this._maxSize;
    }

    /**
     * Get the current size
     * @type {number}
     */
    public get size(): number {
        return this.memory.length;
    }

    /**
     * Sample from memory
     * @param {number} batchSize The size of the batch to sample
     * @param {?seedrandom.PRNG} rng The random number generator to use for sampling
     * @return {BatchSample} The batch sample
     */
    public sample(batchSize: number, rng?: seedrandom.PRNG): BatchSample {
        let samples: Experience[] = General.sampleN(
            this.memory,
            batchSize,
            rng
        );
        return ReplayMemory.toBatch(samples);
    }

    private static toBatch(experiences: Experience[]): BatchSample {
        let stateBatch = new Array<number[]>(experiences.length);
        let takenActionBatch = new Array<number>(experiences.length);
        let newStateBatch = new Array<number[]>(experiences.length);
        let payoffBatch = new Array<number>(experiences.length);
        let contextInfoBatch = new Array<EnvStateContext>(experiences.length);

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

    /**
     * Save an experience in the replay memory
     * @param {Experience} experience The experience to save
     * @returns {void}
     */
    public save(experience: Experience): void {
        const newLength: number = this.memory.push(experience);
        if (newLength > this._maxSize) {
            this.memory.shift();
        }
    }
}

export default DQNAgent;
