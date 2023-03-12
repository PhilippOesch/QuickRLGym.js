import seedrandom from 'seedrandom';
import {
    SingleAgentEnvironment,
    GameStateContext,
    Experience,
} from '../../RLInterface/SingleAgentEnvironment';
import * as tf from '@tensorflow/tfjs';
import { MathUtils, General } from '../../Utils';
import PersistableAgent from '../../RLInterface/PersistableAgent';
import FileStrategy from '../../RLInterface/FileStrategy';

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

export default class DQNAgent extends PersistableAgent {
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
        env: SingleAgentEnvironment,
        config?: DQNAgentSettings,
        randomSeed?: number
    ) {
        super(env);
        this.setRandomSeed(randomSeed);
        this._config = config;
    }

    get config(): object | undefined {
        return this._config;
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
            this._config = config;
            this.epsilon = this._config.epsilonStart;
        }
        this.epsilonStep = 0;
    }

    init(): void {
        if (this._config) {
            this.experienceReplay = new ReplayMemory(
                this._config.replayMemorySize
            );
        }
        // create local qNetwork
        this.qNetworkLocal = this.createNetwork();
        if (this._config) {
            this.epsilon = this._config.epsilonStart;

            // when active create target network for DDQN
            if (this._config.activateDoubleDQN)
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
            this.experienceReplay.getSize >= this._config!.replayMemoryInitSize
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

        const hiddenLayerAct = this._config?.hiddenLayerActivation
            ? this._config?.hiddenLayerActivation
            : 'relu';

        // hidden layer
        model.add(
            tf.layers.dense({
                inputShape: [this.env.stateDim.length],
                activation: hiddenLayerAct as any,
                units: this._config!.nnLayer[0],
                kernelInitializer: 'heUniform',
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
                    kernelInitializer: 'heUniform',
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

    public async save(
        fileManager: FileStrategy,
        options?: object
    ): Promise<void> {
        await fileManager.save(this.qNetworkLocal, options);
    }

    async load(fileManager: FileStrategy, options?: object): Promise<void> {
        this.qNetworkLocal = <tf.Sequential>await fileManager.load(options);

        const adamOptimizer = tf.train.adam(this._config!.learningRate);

        this.qNetworkLocal.compile({
            optimizer: adamOptimizer,
            loss: 'meanSquaredError',
            metrics: ['accuracy'],
        });
        this.qNetworkLocal.summary();

        //additionally load target network when needed
        if (this._config?.activateDoubleDQN) {
            this.qNetworkTarget = <tf.Sequential>await fileManager.load();

            const adamOptimizer = tf.train.adam(this._config.learningRate);

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
