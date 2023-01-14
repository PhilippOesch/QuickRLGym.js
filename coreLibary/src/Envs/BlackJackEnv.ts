import { EnvOptions, SingleAgentEnvironment, StepResult } from '../index';
import { BlackJackGame, BlackJackGameState } from '../Games/BlackJack/index';

export interface BlackJackStats {
    averageReturn: number;
    averageDealerScore: number;
    averagePlayerScore: number;
}

export default class BlackJackEnv extends SingleAgentEnvironment {
    private _game: BlackJackGame;
    private intervalCount: number = 0;
    private averagePlayerScore: number = 0;
    private averageReturn: number = 0;
    private averageDealerScore: number = 0;
    private static _name: string = 'BlackJack';

    public get stats(): BlackJackStats {
        return {
            averageReturn: this.intervalCount
                ? this.averageReturn / this.intervalCount
                : 0,
            averageDealerScore: this.intervalCount
                ? this.averageDealerScore / this.intervalCount
                : 0,
            averagePlayerScore: this.intervalCount
                ? this.averagePlayerScore / this.intervalCount
                : 0,
        };
    }

    public get name(): string {
        return BlackJackEnv._name;
    }

    /**
     * @returns The game object
     */
    public get game(): BlackJackGame {
        return this._game;
    }

    public get stateDim(): number[] {
        return this._game.getGameStateDim;
    }

    public get actionSpace(): string[] {
        return BlackJackGame.getActionSpace;
    }

    public setOptions(options: EnvOptions): void {
        super.setOptions(options);
        if (this.randomSeed) {
            this.game.setRng = this.randomSeed;
        }
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
        this._lastAction = action;
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
        this.intervalCount++;
        const currentStats = this.state as BlackJackGameState;
        this.averagePlayerScore += currentStats.playerScore;
        this.averageReturn += this.getReturn;
        this.averageDealerScore += this._game.getDealer.getScore;
    }

    public override log(trainIteration: number): void {
        console.log('Iteration:', trainIteration);
        console.log(
            'Average Player Score:',
            this.averagePlayerScore / this.intervalCount
        );
        console.log('Average Return:', this.averageReturn / this.intervalCount);
        console.log(
            'Average Dealer Score:',
            this.averageDealerScore / this.intervalCount
        );
        this.resetStats();
    }

    public resetStats(): boolean {
        this.averagePlayerScore = 0;
        this.intervalCount = 0;
        this.averageReturn = 0;
        this.averageDealerScore = 0;
        return true;
    }
}
