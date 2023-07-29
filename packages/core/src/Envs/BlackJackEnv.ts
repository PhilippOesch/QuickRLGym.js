// import { EnvOptions, SingleAgentEnvironment, StepResult } from '../index';
import { EnvOptions } from '../RLInterface/Environment';
import {
    BlackJackAction,
    BlackJackGame,
    BlackJackGameState,
} from '../Games/BlackJack/index';
import { SingleAgentEnvironment } from '../RLInterface/SingleAgentEnvironment';
import StepResult from '../RLInterface/StepResult';

/**
 * The BlackJack stats
 * @category Environments
 * @property {number} averageReturn - the average return
 * @property {number} averageDealerScore The average dealers score
 * @property {number} averagePlayerScore The average players score
 */
export interface BlackJackStats {
    averageReturn: number;
    averageDealerScore: number;
    averagePlayerScore: number;
}

/**
 * The BlackJack Environment
 * @category Environments
 * @extends SingleAgentEnvironment
 */
class BlackJackEnv extends SingleAgentEnvironment {
    private _game: BlackJackGame;
    private intervalCount: number = 0;
    private averagePlayerScore: number = 0;
    private averageReturn: number = 0;
    private averageDealerScore: number = 0;
    private static _name: string = 'BlackJack';

    /**
     * Get the games stats
     * @type {BlackJackStats}
     */
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
     * Get the game object
     * @returns {BlackJackGame} The game object
     */
    public get game(): BlackJackGame {
        return this._game;
    }

    public get stateDim(): number[] {
        return BlackJackGame.gameStateDim;
    }

    public get actionSpace(): string[] {
        return BlackJackGame.actionSpace;
    }

    public setOptions(options: EnvOptions): void {
        super.setOptions(options);
        if (this.randomSeed) {
            this.game.randomSeed = this.randomSeed;
        }
    }

    /**
     * Initialize the environment
     * @param {?EnvOptions} options The environment options
     * @param {?BlackJackGameState} initialGameState The initial game state
     * @returns {void}
     */
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
    public step(
        action: keyof typeof BlackJackAction
    ): StepResult<BlackJackGameState> {
        this._lastAction = action;
        return this._game.step(action);
    }
    public get getReturn(): number {
        return this._game.return;
    }
    public get state(): object {
        return this._game.gameState;
    }
    public reset(): boolean {
        return this._game.reset();
    }
    public get isTerminal(): boolean {
        return this._game.isTerminal;
    }
    public get iteration(): number {
        return this._game.iteration;
    }
    public encodeStateToIndices(state: object): number[] {
        return BlackJackGame.encodeStateToIndices(state as BlackJackGameState);
    }

    public override onIterationEnd(): void {
        this.intervalCount++;
        const currentStats = this.state as BlackJackGameState;
        this.averagePlayerScore += currentStats.playerScore;
        this.averageReturn += this.getReturn;
        this.averageDealerScore += this._game.dealer.score;
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

export default BlackJackEnv;
