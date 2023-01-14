import seedrandom from 'seedrandom';
import Agent from '../../RLInterface/Agent';

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
}

export default class DQNAgent extends Agent {
    private replayMemory: Array<Experience>;
    private rng: seedrandom.PRNG;
    private qNetwork: any;
    private epsilon: number;
    private epsilonStep: number;

    init(): void {
        throw new Error('Method not implemented.');
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
    setOptions(config: object, randomSeed?: number | undefined): void {
        throw new Error('Method not implemented.');
    }
    evalStep(state: object): string {
        throw new Error('Method not implemented.');
    }
    log(): void {
        throw new Error('Method not implemented.');
    }
}
