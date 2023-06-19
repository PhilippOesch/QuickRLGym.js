import { Games, Utils } from '@root/index';

const FieldType = Games.GridWorld.Grid.FieldType;

const size = 10;
const randomSeed = 23;
let game: Games.GridWorld.Game;

beforeEach(() => {
    game = new Games.GridWorld.Game(size, randomSeed);
});

test('positions return correct expected field type', () => {
    game.print();

    const data: [Utils.Vec2, Games.GridWorld.Grid.FieldType][] = [
        [new Utils.Vec2(5, 0), FieldType.BonusField],
        [new Utils.Vec2(5, 2), FieldType.Wall],
        [new Utils.Vec2(6, 1), FieldType.NegativeField],
        [new Utils.Vec2(5, 5), FieldType.Normal],
        [new Utils.Vec2(4, 7), FieldType.EndState],
    ];

    for (const testData of data) {
        const field = game.grid.getField(testData[0]);
        expect(field.type).toBe(testData[1]);
    }

    expect(true);
});
