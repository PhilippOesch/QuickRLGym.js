import seedrandom from 'seedrandom';
import Grid, { FieldType } from './Grid/Grid';
import GridFactory from './Grid/GridFactory';
import { Vec2 } from '@root/Utils';
import GridWorldPlayer from './Player';
import { Player } from '.';
import GridWorldAction from './Action';
import StepResult from '@root/RLInterface/StepResult';
import GridWorldState from './GameState';

/**
 * The grid world game
 * @category Games
 * @subcategory GridWorld
 * @param {number} [size=10] The dimensions of the grid.
 * @param {number?} randomSeed The random seed.
 */
class GridWorldGame {
    private _grid: Grid;
    private _rng: seedrandom.PRNG;
    private static gridFactory: GridFactory = new GridFactory();
    private _player: GridWorldPlayer;
    private _gridSize: number;
    private _gameStateDim: number[];
    private _iteration = 0;

    /**
     * The penalty on an illegal move
     * @type {number}
     */
    public static readonly illegalMovePenalty: number = -10;
    /**
     * The amount of point for reaching a final state.
     * @type {number}
     */
    public static readonly goalReward: number = 5;

    private static readonly asciiSymbols = '░▒▓$╬{}';

    private static readonly fieldTypeToAscii: Map<FieldType, string> = new Map([
        [FieldType.EndState, this.asciiSymbols[4]],
        [FieldType.Normal, this.asciiSymbols[0]],
        [FieldType.Wall, this.asciiSymbols[2]],
        [FieldType.NegativeField, this.asciiSymbols[1]],
        [FieldType.BonusField, this.asciiSymbols[3]],
    ]);

    constructor(size: number = 10, randomSeed?: number) {
        if (randomSeed) {
            this._rng = seedrandom(randomSeed.toString());
        } else {
            this._rng = seedrandom();
        }
        this._gridSize = size;
        this._gameStateDim = [size, size, size, size];
    }

    /**
     * The action string to action mapping
     * @type {Map<string, GridWorldAction>}
     */
    public static readonly actionMapping: Map<string, GridWorldAction> =
        new Map([
            ['Up', GridWorldAction.Up],
            ['Down', GridWorldAction.Down],
            ['Left', GridWorldAction.Left],
            ['Right', GridWorldAction.Right],
        ]);

    /**
     * Get the grid.
     * @type {Grid}
     */
    public get grid(): Grid {
        return this._grid;
    }

    /**
     * Get the player.
     * @type {GridWorldPlayer}
     */
    public get player(): GridWorldPlayer {
        return this._player;
    }

    /**
     * Get the iteration
     * @type {number}
     */
    public get iteration(): number {
        return this._iteration;
    }

    /**
     * Set the games random seed
     * @type {number}
     */
    public set setRng(randomSeed: number) {
        this._rng = seedrandom(randomSeed.toString());
        this.reset();
    }

    /**
     * Initialize the game.
     * @returns {void}
     */
    public init(): void {
        const startigPos = this.getStartingPosition(this._gridSize);
        this._grid = GridWorldGame.gridFactory.create(
            this._gridSize,
            this._rng,
            startigPos
        );
        this._iteration = 0;
        this._player = new Player(this.grid, startigPos);
    }

    /**
     * Encode a state to a numbers array
     * @param {GridWorldState} state The state to encode.
     * @returns {number[]} The encoded numbers array.
     */
    public static encodeStateToIndices(state: GridWorldState): number[] {
        return [
            state.playerPos.x,
            state.playerPos.y,
            state.goalPos.x,
            state.goalPos.y,
        ];
    }

    /**
     * Play an environment step.
     * @param actionString The action to take.
     * @returns {StepResult<GridWorldState>} The result of the action.
     */
    public step(actionString: string): StepResult<GridWorldState> {
        this._iteration++;
        const action = GridWorldGame.actionMapping.get(actionString)!;
        const reward = this.player.act(action);
        return {
            newState: this.state,
            reward: reward,
        };
    }

    /**
     * Get the current environment state
     * @type {GridWorldState}
     */
    public get state(): GridWorldState {
        return {
            playerPos: this.player.pos,
            goalPos: this.grid.goal.position,
        };
    }

    /**
     * Get a starting position.
     * @param size the size of the grid.
     * @returns {Vec2} The starting position.
     */
    private getStartingPosition(size: number): Vec2 {
        const x = Math.round(this._rng());
        const y = Math.round(this._rng());

        return new Vec2(x * (size - 1), y * (size - 1));
    }

    /**
     * Reset the game
     * @returns {boolean} Whether the reset was successful
     */
    public reset(): boolean {
        this.init();
        return true;
    }

    public get gameStateDim(): number[] {
        return this._gameStateDim;
    }

    /**
     * Get the action space.
     * @returns {string[]}
     */
    public static get getActionSpace(): string[] {
        return Array.from(GridWorldGame.actionMapping.keys());
    }

    /**
     * Get the games current return
     * @type {number}
     */
    public get return(): number {
        return this.player.return;
    }

    /**
     * Get whether the environment has reached a terminal state.
     * @type {boolean}
     */
    public get isTerminal(): boolean {
        return this.player.field.type === FieldType.EndState;
    }

    /**
     * Print the environment in the console.
     * @returns {void}
     */
    public print(): void {
        let printString = '';

        for (let y = 0; y < this._grid.size; y++) {
            for (let x = 0; x < this._grid.size; x++) {
                if (this.player.pos.isEqual(new Vec2(x, y))) {
                    printString +=
                        GridWorldGame.asciiSymbols[5] +
                        GridWorldGame.asciiSymbols[6];
                    continue;
                }
                const symbol = GridWorldGame.fieldTypeToAscii.get(
                    this._grid.getField(new Vec2(x, y)).type
                );
                printString += symbol! + symbol!;
            }
            printString += '\n';
        }

        console.log(printString);
    }

    /**
     * Get the random number generator
     * @type {seedrandom.PRNG}
     */
    public get rng(): seedrandom.PRNG {
        return this._rng;
    }
}

export default GridWorldGame;
