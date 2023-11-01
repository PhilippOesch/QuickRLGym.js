import { SingleAgentEnvironment } from '../RLInterface/SingleAgentEnvironment';
import StepResult from '../RLInterface/StepResult';
import GridWorldState from '../Games/GridWorld/GameState';
import GridWorldAction from '../Games/GridWorld/Action';
import { EnvOptions } from '../RLInterface/Environment';
import GridWorldGame from '@root/Games/GridWorld/GridWorldGame';

export type GridWorldStats = {
    avgGameIterations: number;
    avgGameScore: number;
};

class GridWorldEnv extends SingleAgentEnvironment {
    private _game: GridWorldGame;
    private intervalCount: number = 0;
    private avgGameIterations: number = 0;
    private avgGameScore: number = 0;
    private static _name = 'GridWorld';

    public init(options?: EnvOptions) {
        super.init(options);
        if (options) {
            this._game = new GridWorldGame(options.randomSeed);
        } else {
            this._game = new GridWorldGame();
        }
        this._game.init();
    }

    public get getReturn(): number {
        return this._game.return;
    }
    get stateDim(): number[] {
        return this._game.gameStateDim;
    }
    get actionSpace(): string[] {
        return GridWorldGame.getActionSpace;
    }
    get state(): GridWorldState {
        throw this._game.state;
    }
    get isTerminal(): boolean {
        return this._game.isTerminal;
    }
    get iteration(): number {
        return this._game.iteration;
    }

    /**
     * Return the taxi problem game
     * @returns {TaxiGame} The game object
     */
    public get game(): GridWorldGame {
        return this._game;
    }

    /**
     * Return the environment stats
     * @type {GridWorldStats}
     */
    get stats(): GridWorldStats {
        return {
            avgGameIterations: this.intervalCount
                ? this.avgGameIterations / this.intervalCount
                : 0,
            avgGameScore: this.intervalCount
                ? this.avgGameScore / this.intervalCount
                : 0,
        };
    }
    get name(): string {
        return GridWorldEnv._name;
    }
    public step(
        action: keyof typeof GridWorldAction
    ): StepResult<GridWorldState> {
        this._lastAction = action;
        return this._game.step(action);
    }
    reset(): boolean {
        return this._game.reset();
    }
    encodeStateToIndices(state: GridWorldState): number[] {
        return GridWorldGame.encodeStateToIndices(state);
    }
    resetStats(): boolean {
        this.avgGameIterations = 0;
        this.intervalCount = 0;
        this.avgGameScore = 0;
        return true;
    }

    public override onIterationEnd(): void {
        this.intervalCount++;
        this.avgGameIterations += this.iteration;
        this.avgGameScore += this._game.return;
    }

    public override log(trainIteration: number): void {
        console.log('Iteration:', trainIteration);
        console.log(
            'average Game Iterations:',
            this.avgGameIterations / this.intervalCount
        );
        console.log(
            'average Game Score:',
            this.avgGameScore / this.intervalCount
        );
    }

    public setOptions(options: EnvOptions): void {
        super.setOptions(options);
        if (this.randomSeed) {
            this._game.setRng = this.randomSeed;
        }
    }
}

export default GridWorldEnv;
