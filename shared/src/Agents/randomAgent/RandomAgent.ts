import seedrandom from 'seedrandom';
import { Agent } from '../../index';

/**
 * Agent For selecting Random Actions
 */
export default class RandomAgent extends Agent {
    private rng: seedrandom.PRNG;
    private randomSeed?: string;

    constructor(actionSpace: string[], randomSeed?: number) {
        super(actionSpace);
        if (randomSeed != undefined) {
            this.randomSeed = randomSeed.toString();
            this.rng = seedrandom(this.randomSeed);
        } else {
            this.rng = seedrandom();
        }
    }

    public init(): void {
        console.log('Random Agent initialized');
    }

    public step(): string {
        const randomActionIdx: number = Math.floor(
            this.rng() * this.actionSpace.length
        );
        return this.actionSpace[randomActionIdx];
    }

    public evalStep(): string {
        return this.step();
    }

    log(): void {
        return;
    }

    feed(): void {
        return;
    }
}
