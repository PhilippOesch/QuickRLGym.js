import { TaxiGame, TaxiGameState } from '../Games/TaxiGame/index';
import { StepResult, SingleAgentEnvironment, EnvOptions } from '../index';

export interface TaxiStats {
    averageGameIterations: number;
    averageGameScore: number;
}

export default class TaxiEnv extends SingleAgentEnvironment {
    private _game: TaxiGame;
    private logIntervalCount: number = 0;
    private averageGameIterations: number = 0;
    private averageGameScore: number = 0;

    constructor(options?: EnvOptions, initialGameState?: TaxiGameState) {
        super((options = options), (initialGameState = initialGameState));
        if (options) {
            this._game = new TaxiGame(options.randomSeed);
        } else {
            this._game = new TaxiGame();
        }
    }

    public get stats(): TaxiStats {
        return {
            averageGameIterations: this.logIntervalCount
                ? this.averageGameIterations / this.logIntervalCount
                : 0,
            averageGameScore: this.logIntervalCount
                ? this.averageGameScore / this.logIntervalCount
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
        return this._game.step(action);
    }

    public initEnv(): void {
        this._game.initGame();
        super.initEnv();
    }

    public reset(): boolean {
        return this._game.reset(true, this.initialState as TaxiGameState);
    }

    public encodeStateToIndices(state: object): number[] {
        return this._game.encodeStateToIndices(state as TaxiGameState);
    }

    public override onIterationEnd(): void {
        this.logIntervalCount++;
        this.averageGameIterations += this.iteration;
        this.averageGameScore += this._game.return;
    }

    public override log(trainIteration: number): void {
        console.log('Iteration:', trainIteration);
        console.log(
            'average Game Iterations:',
            this.averageGameIterations / this.logIntervalCount
        );
        console.log(
            'average Game Score:',
            this.averageGameScore / this.logIntervalCount
        );
        this.averageGameIterations = 0;
        this.logIntervalCount = 0;
    }
}
