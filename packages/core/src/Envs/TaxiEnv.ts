import { SingleAgentEnvironment } from '../RLInterface/SingleAgentEnvironment';
import { TaxiAction, TaxiGame, TaxiGameState } from '../Games/TaxiGame/index';
import StepResult from '../RLInterface/StepResult';
import { EnvOptions } from '../RLInterface/Environment';
import { TaxiActionKey } from '@root/Games/TaxiGame/Action';

/**
 * The Taxi Environment stats
 * @category Environments
 * @property {number} averageGameIterations - The average amount of game iterations
 * @property {number} averageGameScore The average game score achieved
 */
export interface TaxiStats {
    avgGameIterations: number;
    avgGameScore: number;
}

/**
 * The Taxi Problem Environment
 * @category Environments
 * @extends SingleAgentEnvironment
 */
class TaxiEnv extends SingleAgentEnvironment {
    private _game: TaxiGame;
    private intervalCount: number = 0;
    private averageGameIterations: number = 0;
    private averageGameScore: number = 0;
    private static _name = 'Taxi';

    /**
     * Initialize the environment
     * @param {?EnvOptions} options The enviroment options
     * @param {?TaxiGameState} initialState The initial taxi game state
     * @returns {void}
     */
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

    /**
     * Return the environment stats
     * @type {TaxiStats}
     */
    public get stats(): TaxiStats {
        return {
            avgGameIterations: this.intervalCount
                ? this.averageGameIterations / this.intervalCount
                : 0,
            avgGameScore: this.intervalCount
                ? this.averageGameScore / this.intervalCount
                : 0,
        };
    }

    public get stateDim(): number[] {
        return TaxiGame.gameStateDim;
    }

    /**
     * Return the taxi problem game
     * @returns {TaxiGame} The game object
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

    /**
     * Get the game state
     * @type {TaxiGameState}
     */
    public get state(): TaxiGameState {
        return this._game.gameState;
    }

    public get getReturn(): number {
        return this._game.return;
    }

    public step(action: TaxiActionKey): StepResult<TaxiGameState> {
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
        this.averageGameScore = 0;
        return true;
    }

    public encodeStateToIndices(state: object): number[] {
        return TaxiGame.encodeStateToIndices(state as TaxiGameState);
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
    }
}

export default TaxiEnv;
