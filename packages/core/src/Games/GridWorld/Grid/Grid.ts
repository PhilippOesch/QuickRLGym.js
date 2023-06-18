import { Vec2 } from 'src/Utils';

export enum FieldType {
    Normal,
    Wall,
    EndState,
}

export interface GridField {
    reward: number;
    type: FieldType;
    position: Vec2;
}

class Grid {
    private _size: number;
    private _grid: GridField[][];

    constructor(grid: GridField[][]) {
        this._grid = grid;
        this._size = grid.length;
    }

    get size(): number {
        return this._size;
    }

    public getField(vec: Vec2): GridField {
        return this._grid[vec.y][vec.x];
    }
}

export default Grid;
