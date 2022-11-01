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

    public incrementIterations(): void {
        this.iterations++;
    }

    public terminateGame(): void {
        this.isTerminal = true;
    }

    public updatePoints(pointDifferential: number) {
        this.points += pointDifferential;
    }

    public resetGameState() {
        this.points = 0;
        this.iterations = 0;
        this.isTerminal = false;
    }
}
