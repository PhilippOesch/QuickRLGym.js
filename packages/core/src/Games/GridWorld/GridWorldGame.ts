import seedrandom from 'seedrandom';
import Grid, { FieldType, GridField } from './Grid/Grid';
import GridFactory from './Grid/GridFactory';
import { Vec2 } from 'src/Utils';

class GridWorldGame {
    private _grid: Grid;
    private _rng: seedrandom.PRNG;
    private static gridFactory: GridFactory = new GridFactory();
    private startingField: GridField;

    private static readonly asciiSymbols = '░▓╬o';

    private static readonly fieldTypeToAscii: Map<FieldType, string> = new Map([
        [FieldType.EndState, this.asciiSymbols[2]],
        [FieldType.Normal, this.asciiSymbols[0]],
        [FieldType.Wall, this.asciiSymbols[1]],
    ]);

    public get grid(): Grid {
        return this._grid;
    }

    constructor(randomSeed?: number, size: number = 8) {
        if (randomSeed) {
            this._rng = seedrandom(randomSeed.toString());
        } else {
            this._rng = seedrandom();
        }
        const startigPos = this.getStartingPosition(size);
        this._grid = GridWorldGame.gridFactory.create(
            size,
            this._rng,
            startigPos
        );
        this.startingField = this._grid.getField(startigPos);
    }

    private getStartingPosition(size: number): Vec2 {
        const x = Math.round(this._rng());
        const y = Math.round(this._rng());

        return new Vec2(x * (size - 1), y * (size - 1));
    }

    public print(): void {
        let printString = '';

        for (let y = 0; this._grid.size; y++) {
            for (let x = 0; this._grid.size; x++) {
                if (this.startingField.position.isEqual(new Vec2(x, y))) {
                    printString += GridWorldGame.asciiSymbols[3];
                    continue;
                }
                printString += GridWorldGame.fieldTypeToAscii.get(
                    this._grid.getField(new Vec2(x, y)).type
                );
            }
            printString += '\\n';
        }

        console.log(printString);
    }
}

export default GridWorldGame;
