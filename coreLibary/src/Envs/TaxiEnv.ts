import { TaxiGame, TaxiGameState } from '../Games/TaxiGame/index';
import { StepResult, SingleAgentEnvironment, EnvOptions } from '../index';

export interface TaxiStats {
    averageGameIterations: number;
    averageGameScore: number;
}

export default class TaxiEnv extends SingleAgentEnvironment {
    private _game: TaxiGame;
    private intervalCount: number = 0;
    private averageGameIterations: number = 0;
    private averageGameScore: number = 0;
    private static _name = 'Taxi';

    public init(options?: EnvOptions, initialState?: TaxiGameState): void {
        super.init(options, initialState);
        if (options) {
            this._game = new TaxiGame(options.randomSeed);
        } else {
            this._game = new TaxiGame();
        }
        this._game.initGame();
    }

    public get name(): string {
        return TaxiEnv._name;
    }

    public get stats(): TaxiStats {
        return {
            averageGameIterations: this.intervalCount
                ? this.averageGameIterations / this.intervalCount
                : 0,
            averageGameScore: this.intervalCount
                ? this.averageGameScore / this.intervalCount
                : 0,
        };
    }

    public get gameStateDim(): number[] {
        return this._game.gameStateDim;
    }

    /**
     * @returns The game object
     */
    public get game(): TaxiGame {
        return this._game;
    }

    public get actionSpace(): string[] {
        return TaxiGame.getActionSpace;
    }

    public get isTerminal(): boolean {
        return this._game.isTerminal;
    }
    public get iteration(): number {
        return this._game.iteration;
    }

    public get state(): TaxiGameState {
        return this._game.gameState as TaxiGameState;
    }

    public get getReturn(): number {
        return this._game.return;
    }

    public step(action: string): StepResult {
        this._lastAction = action;
        return this._game.step(action);
    }

    public setOptions(options: EnvOptions): void {
        super.setOptions(options);
        if (this.randomSeed) {
            this.game.setRng = this.randomSeed;
        }
    }

    public reset(): boolean {
        return this._game.reset(true, this.initialState as TaxiGameState);
    }

    public resetStats(): boolean {
        this.averageGameIterations = 0;
        this.intervalCount = 0;
        return true;
    }

    public encodeStateToIndices(state: object): number[] {
        return this._game.encodeStateToIndices(state as TaxiGameState);
    }

    public override onIterationEnd(): void {
        this.intervalCount++;
        this.averageGameIterations += this.iteration;
        this.averageGameScore += this._game.return;
    }

    public override log(trainIteration: number): void {
        console.log('Iteration:', trainIteration);
        console.log(
            'average Game Iterations:',
            this.averageGameIterations / this.intervalCount
        );
        console.log(
            'average Game Score:',
            this.averageGameScore / this.intervalCount
        );
        this.resetStats();
    }
}
