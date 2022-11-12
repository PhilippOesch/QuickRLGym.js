import seedrandom from "seedrandom";
import StepResult from "./TaxiGame/StepResult";

abstract class Game {
    protected rng;
    protected isTerminal: boolean = false;
    protected points: number = 0;
    protected iteration: number = 0;

    constructor(randomSeed?: number) {
        if (randomSeed) {
            this.rng = seedrandom(randomSeed.toString());
        } else {
            this.rng = seedrandom();
        }
    }

    public abstract get getGameState(): object;

    public get getPayoff(): number {
        return Number(this.points);
    }

    public get getIsTerminal(): boolean {
        return this.isTerminal;
    }

    public get getRng(): seedrandom.PRNG {
        return this.rng;
    }

    public get getIteration(): number {
        return this.iteration;
    }

    public abstract initGame(): void;

    public abstract reset(
        resetGameState: boolean,
        initialGameState?: object
    ): boolean;

    public abstract step(actionString: string): StepResult;

    public incrementIterations(): void {
        this.iteration++;
    }

    public updatePoints(points: number): void {
        this.points += points;
    }
}

export default Game;
