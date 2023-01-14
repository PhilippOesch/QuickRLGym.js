import seedrandom from 'seedrandom';
import Agent from '../../RLInterface/Agent';
import SingleAgentEnvironment from '../../RLInterface/SingleAgentEnvironment';
import * as tf from '@tensorflow/tfjs';

interface Experience {
    prevState: object;
    takenAction: string;
    newState: object;
    payoff: number;
    contextInfo: object;
}

export interface DQNAgentSettings {
    learningRate: number;
    discountFactor: number;
    nnLayer: number[];
    epsilonStart: number;
    epsilonEnd: number;
    epsilonDecaySteps: number;
    hiddenLayerActivation?: string;
}

export default class DQNAgent extends Agent {
    private config?: DQNAgentSettings;
    private rng: seedrandom.PRNG;
    private experienceReplay = ReplayMemory;
    private randomSeed?: string;
    private qNetwork: tf.Sequential;
    private epsilon: number;
    private epsilonStep: number;

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
        this.qNetwork = this.createNetwork();
    }
    step(state: object): string {
        throw new Error('Method not implemented.');
    }
    feed(
        prevState: object,
        takenAction: string,
        newState: object,
        payoff: number,
        contextInfo: object
    ): void {
        throw new Error('Method not implemented.');
    }
    evalStep(state: object): string {
        throw new Error('Method not implemented.');
    }
    log(): void {
        throw new Error('Method not implemented.');
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

        model.compile({
            optimizer: tf.train.adam(),
            loss: 'meanSquaredError',
            metrics: ['mse'],
        });
        model.summary();

        return model;
    }
}

class ReplayMemory {
    memory: Experience[];

    private sample(): Experience {
        throw new Error('Method not implemented.');
    }

    private save(experience: Experience) {
        this.memory;
    }
}
