import seedrandom from "seedrandom";
import StepResult from "./TaxiGame/StepResult";

/**
 * Abstract Game class for Implementing own games
 */
abstract class Game {
    protected rng;
    protected isTerminal: boolean = false;
    protected points: number = 0;
    protected iteration: number = 0;

    /**
     * @param {number} randomSeed - Random Seed for reproducing environments
     */
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

    /**
     * Initialize the Game
     */
    public abstract initGame(): void;

    /**
     * Reset the game
     * @param {boolean} resetGameState - whether to completely reset the game state
     * @param {object} initialGameState - provide an initial game state
     * @r
     */
    public abstract reset(
        resetGameState: boolean,
        initialGameState?: object
    ): boolean;

    /**
     * perform an action
     * @param {string} actionString - The action to perform
     * @returns {StepResult} The resulting followup state
     */
    public abstract step(actionString: string): StepResult;

    /**
     * encode The game state to an indice array
     * @param {object} state - The game state
     * @returns {number []} An encoded number array
     */
    public abstract encodeStateToIndices(state: object): number[];

    /**
     * End the game
     */
    public abstract terminateGame(): void;

    /**
     * Increment an iteration
     */
    public incrementIterations(): void {
        this.iteration++;
    }

    /**
     * update the Point score
     * @param {number} points - the point differential
     */
    public updatePoints(points: number): void {
        this.points += points;
    }
}

export default Game;
