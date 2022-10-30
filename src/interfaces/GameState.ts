class GameState {
    private iterations: number = 0;
    private points: number = 0;

    public get getPoints(): number {
        return this.points;
    }

    public get getIterations(): number {
        return this.iterations;
    }

    public incrementIterations(): void {
        this.iterations++;
    }

    public updatePoints(pointDifferential: number) {
        this.points += pointDifferential;
    }

    public resetGameState() {
        this.points = 0;
        this.iterations = 0;
    }
}

export default GameState;
