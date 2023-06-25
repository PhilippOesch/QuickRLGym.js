import { Vec2 } from '@root/Utils';
import GridWorldAction from './Action';
import GridWorldGame from './GridWorldGame';
import seedrandom from 'seedrandom';
import { Grid, GridField } from './Grid';

/**
 * The player.
 * @category Games
 * @subcategory GridWorld
 * @param {Grid} grid The reference to the game grid
 * @param {Vec2} startPosition The starting position of the player
 */
class GridWorldPlayer {
    private _pos: Vec2;
    private _return: number = 0;
    private _grid: Grid;
    private _field: GridField;

    private static readonly directionMapping: Map<GridWorldAction, Vec2> =
        new Map([
            [GridWorldAction.Up, new Vec2(0, -1)],
            [GridWorldAction.Down, new Vec2(0, 1)],
            [GridWorldAction.Left, new Vec2(-1, 0)],
            [GridWorldAction.Right, new Vec2(1, 0)],
        ]);

    constructor(grid: Grid, startPosition?: Vec2) {
        if (startPosition) {
            this._pos = startPosition;
        }
        this._grid = grid;
    }

    /**
     * The player position.
     * @type {Vec2}
     */
    public get pos(): Vec2 {
        return this._pos;
    }

    /**
     * The current players return.
     * @type {number}
     */
    public get return(): number {
        return this._return;
    }

    /**
     * The current field the player consides on
     * @type {GridField}
     */
    public get field(): GridField {
        return this._field;
    }

    /**
     * Let player act.
     * @param {GridWorldAction} action The action.
     * @returns {number} The reward.
     */
    public act(action: GridWorldAction): number {
        const newPosition = this._pos.copy();
        newPosition.add(GridWorldPlayer.directionMapping.get(action)!);
        if (
            this._grid.insideBorders(newPosition) &&
            !this._grid.isWall(newPosition)
        ) {
            this._pos = newPosition;
            this._field = this._grid.getField(this._pos);
            this._return += this._field.reward;
            return this._field.reward;
        }
        this._return += GridWorldGame.illegalMovePenalty;
        return GridWorldGame.illegalMovePenalty;
    }
}

export default GridWorldPlayer;
