import seedrandom from 'seedrandom';
import { Agent } from '../../index';
import Environment from '../../RLInterface/Environment';

/**
 * Agent For selecting Random Actions
 */
export default class RandomAgent extends Agent {
    private rng: seedrandom.PRNG;
    private randomSeed?: string;

    constructor(env: Environment, randomSeed?: number) {
        super(env);
        if (randomSeed != undefined) {
            this.randomSeed = randomSeed.toString();
            this.rng = seedrandom(this.randomSeed);
        } else {
            this.rng = seedrandom();
        }
    }

    public setConfig(options: object): void {
        return;
    }

    public init(): void {
        console.log('Random Agent initialized');
    }

    public step(): string {
        const randomActionIdx: number = Math.floor(
            this.rng() * this.env.actionSpace.length
        );
        return this.env.actionSpace[randomActionIdx];
    }

    public evalStep(): string {
        return this.step();
    }

    log(): void {
        return;
    }

    async feed(): Promise<void> {
        return;
    }
}
