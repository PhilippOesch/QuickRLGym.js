/**
 * The class that manages points, iterations and whether the game has terminated.
 * @property {number} iterations - The number of iterations.
 * @property {number} points - The number of points, the player has received
 * @property {boolean} isTerminal - Set when the game episode has terminated.
 */
export default class GameStateManager {
    private iterations: number = 0;
    private points: number = 0;
    private isTerminal: boolean = false;

    public get getPoints(): number {
        return this.points;
    }

    public get getIterations(): number {
        return this.iterations;
    }

    public get getIsTerminal(): boolean {
        return this.isTerminal;
    }

    /**
     * Unset the terminate property
     */
    public continue(): void {
        this.isTerminal = false;
    }

    /**
     * Count up an iteration
     */
    public incrementIterations(): void {
        this.iterations++;
    }

    /**
     * Terminate the game.
     * @returns {void}
     */
    public terminateGame(): void {
        this.isTerminal = true;
    }

    /**
     * Terminate the game
     * @param {number} pointDifferential - Add or remove the specified amount of points.
     */
    public updatePoints(pointDifferential: number): void {
        this.points += pointDifferential;
    }

    /**
     * Reset the game state.
     */
    public resetGameState() {
        this.points = 0;
        this.iterations = 0;
        this.isTerminal = false;
    }
}
