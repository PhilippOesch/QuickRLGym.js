import { Vec2 } from '../../../Utils';

/**
 * Type of a grid Field.
 * @category Games
 * @subcategory GridWorld
 */
export enum FieldType {
    Normal,
    Wall,
    EndState,
    NegativeField,
    BonusField,
}

/**
 * Field in the grid.
 * @category Games
 * @subcategory GridWorld
 */
export interface GridField {
    reward: number;
    type: FieldType;
    position: Vec2;
}

/**
 * The grid.
 * @category Games
 * @subcategory GridWorld
 */
class Grid {
    private _size: number;
    private _grid: GridField[][];
    private _startingField: GridField;
    private _goal: GridField;

    constructor(grid: GridField[][], start: Vec2, goal: Vec2) {
        this._grid = grid;
        this._size = grid.length;
        this._startingField = this._grid[start.y][start.x];
        this._goal = this._grid[goal.y][goal.x];
    }

    get goal(): GridField {
        return this._goal;
    }

    /**
     * The grid size.
     * @type {number}
     */
    get size(): number {
        return this._size;
    }

    /**
     * The starting grid field.
     * @type {GridField}
     */
    get start(): GridField {
        return this._startingField;
    }

    /**
     * Whether the position is a wall.
     * @param {GridField[][]} grid The grid.
     * @param {Vec2} vec The position.
     * @returns {boolean}
     */
    public isWall(vec: Vec2): boolean {
        if (!this.insideBorders(vec)) {
            return false;
        }
        return this._grid[vec.y][vec.x].type === FieldType.Wall;
    }

    /**
     * decide whether a position lies inside the grid borders.
     * @param {Vec2} vec The position.
     * @returns {boolean} Whether a position lies inside the borders.
     */
    public insideBorders(vec: Vec2): boolean {
        return (
            vec.x >= 0 && vec.x < this._size && vec.y >= 0 && vec.y < this._size
        );
    }

    /**
     * Get the field at a position.
     * @param {Vec2} vec The 2d vector of the position.
     * @returns {GridField} The grid field.
     */
    public getField(vec: Vec2): GridField {
        return this._grid[vec.y][vec.x];
    }

    /**
     * Get reachable neighbors for a position
     * @param {Vec2} vec The position to find the neighbors for.
     * @param {GridField[][]} grid The grid.
     * @returns {GridField[]} The list of neighbors.
     */
    public getNeighbors(vec: Vec2): GridField[] {
        const neighbors: GridField[] = [];

        const neighborVectors: Vec2[] = [
            new Vec2(vec.x + 1, vec.y),
            new Vec2(vec.x - 1, vec.y),
            new Vec2(vec.x, vec.y + 1),
            new Vec2(vec.x, vec.y - 1),
        ];

        for (const vector of neighborVectors) {
            if (!this.insideBorders(vector)) {
                continue;
            }

            if (!this.isWall(vector)) {
                neighbors.push(this._grid[vector.y][vector.x]);
            }
        }

        return neighbors;
    }
}

export default Grid;
