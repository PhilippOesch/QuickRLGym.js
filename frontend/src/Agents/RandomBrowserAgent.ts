import seedrandom from "seedrandom";
import BrowserAgent from "./BrowserAgent";

export default class RandomBrowserAgent extends BrowserAgent {
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

    public async load(): Promise<void> {
        console.log("Random Agent loaded");
    }
    public evalStep(state: object): string {
        const randomActionIdx: number = Math.floor(
            this.rng() * this.actionSpace.length
        );
        return this.actionSpace[randomActionIdx];
    }
}
