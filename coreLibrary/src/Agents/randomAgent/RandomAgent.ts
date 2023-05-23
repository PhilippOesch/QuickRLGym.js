import seedrandom from 'seedrandom';
import { Agent } from '../../index';
import Environment from '../../RLInterface/Environment';

/**
 * Agent For selecting Random Actions
 * @category Agents
 * @param {Environment} env - The environment
 * @param {number} randomSeed - The random seed
 * @extends Agent
 */
class RandomAgent extends Agent {
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

    get config(): object | undefined {
        return { randomSeed: this.randomSeed };
    }

    public setConfig(options?: object, randomSeed?: number): void {
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
            this.rng() * this.env.actionSpace.length
        );
        return this.env.actionSpace[randomActionIdx];
    }

    public evalStep(): string {
        return this.step();
    }

    public log(): void {
        return;
    }

    public async feed(): Promise<void> {
        return;
    }
}

export default RandomAgent;
