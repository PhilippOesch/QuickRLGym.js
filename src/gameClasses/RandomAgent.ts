import seedrandom from "seedrandom";
import Agent from "../interfaces/Agent";
import GameState from "../interfaces/GameState";

export default class RandomAgent extends Agent {
    private rng: seedrandom.PRNG;
    private randomSeed: string;

    constructor(actionSpace: string[], randomSeed: number) {
        super(actionSpace);
        this.randomSeed = randomSeed.toString();
        this.rng = seedrandom(this.randomSeed);
    }

    public init(): void {
        console.log("Random Agent initialized");
    }

    public step(state: GameState): string {
        const randomActionIdx: number = Math.floor(
            this.rng() * this.actionSpace.length
        );
        return this.actionSpace[randomActionIdx];
    }

    public eval_step(state: GameState): string {
        return this.step(state);
    }
}
