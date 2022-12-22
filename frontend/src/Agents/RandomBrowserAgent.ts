import seedrandom from 'seedrandom';
import { Environment } from '../../../shared/src';
import BrowserAgent from './BrowserAgent';

export default class RandomBrowserAgent extends BrowserAgent {
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

    public async load(): Promise<void> {
        console.log('Random Agent loaded');
    }
    public evalStep(state: object): string {
        const randomActionIdx: number = Math.floor(
            this.rng() * this.env.getActionSpace.length
        );
        return this.env.getActionSpace[randomActionIdx];
    }
}
