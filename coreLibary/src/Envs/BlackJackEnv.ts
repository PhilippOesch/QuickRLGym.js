import { EnvOptions, SingleAgentEnvironment, StepResult } from '../index';
import { BlackJackGame, BlackJackGameState } from '../Games/BlackJack/index';

export interface BlackJackStats {
    averageReturn: number;
    averageDealerScore: number;
    averagePlayerScore: number;
}

export default class BlackJackEnv extends SingleAgentEnvironment {
    private _game: BlackJackGame;
    private logIntervalCount: number = 0;
    private averagePlayerScore: number = 0;
    private averageReturn: number = 0;
    private averageDealerScore: number = 0;

    public get stats(): BlackJackStats {
        return {
            averageReturn: this.logIntervalCount
                ? this.averageReturn / this.logIntervalCount
                : 0,
            averageDealerScore: this.logIntervalCount
                ? this.averageDealerScore / this.logIntervalCount
                : 0,
            averagePlayerScore: this.logIntervalCount
                ? this.averagePlayerScore / this.logIntervalCount
                : 0,
        };
    }

    /**
     * @returns The game object
     */
    public get game(): BlackJackGame {
        return this._game;
    }

    public get gameStateDim(): number[] {
        return this._game.getGameStateDim;
    }

    public get actionSpace(): string[] {
        return BlackJackGame.getActionSpace;
    }

    public setOptions(options: EnvOptions): void {
        this.options = options;
    }

    public init(
        options?: EnvOptions,
        initialGameState?: BlackJackGameState
    ): void {
        super.init(options, initialGameState);
        if (options) {
            this._game = new BlackJackGame(options.randomSeed);
        } else {
            this._game = new BlackJackGame();
        }
        this._game.initGame();
    }
    public step(action: string): StepResult {
        return this._game.step(action);
    }
    public get getReturn(): number {
        return this._game.getReturn;
    }
    public get state(): object {
        return this._game.getGameState;
    }
    public reset(): boolean {
        return this._game.reset();
    }
    public get isTerminal(): boolean {
        return this._game.getIsTerminal;
    }
    public get iteration(): number {
        return this._game.getIteration;
    }
    public encodeStateToIndices(state: object): number[] {
        return this._game.encodeStateToIndices(state as BlackJackGameState);
    }

    public override onIterationEnd(): void {
        this.logIntervalCount++;
        const currentState = this.state as BlackJackGameState;
        this.averagePlayerScore += currentState.playerScore;
        this.averageReturn += this.getReturn;
        this.averageDealerScore += this._game.getDealer.getScore;
    }

    public override log(trainIteration: number): void {
        console.log('Iteration:', trainIteration);
        console.log(
            'Average Player Score:',
            this.averagePlayerScore / this.logIntervalCount
        );
        console.log(
            'Average Return:',
            this.averageReturn / this.logIntervalCount
        );
        console.log(
            'Average Dealer Score:',
            this.averageDealerScore / this.logIntervalCount
        );
        this.averagePlayerScore = 0;
        this.logIntervalCount = 0;
        this.averageReturn = 0;
        this.averageDealerScore = 0;
    }
}
