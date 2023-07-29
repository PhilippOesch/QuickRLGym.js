import { Games, Utils } from '@root/index';

const FieldType = Games.GridWorld.Grid.FieldType;

const size = 10;
const randomSeed = 23;
let game: Games.GridWorld.Game;

beforeEach(() => {
    game = new Games.GridWorld.Game(size, randomSeed);
    game.init();
});

test('positions return correct expected field type', () => {
    game.print();

    const data: [Utils.Vec2, Games.GridWorld.Grid.FieldType][] = [
        [new Utils.Vec2(6, 9), FieldType.BonusField],
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

test('action - move up - reward = -10, position is same', () => {
    const result = game.step('Up');

    expect(result.reward).toBe(-10);
    expect(result.newState.playerPos.isEqual(new Utils.Vec2(0, 0))).toBe(true);
});

test('action - move down - reward = 0, position is one down', () => {
    const result = game.step('Down');

    expect(result.reward).toBe(0);
    expect(result.newState.playerPos.isEqual(new Utils.Vec2(0, 1))).toBe(true);
});

test('action - move right - reward = 0, position is same', () => {
    const result = game.step('Left');

    expect(result.reward).toBe(-10);
    expect(result.newState.playerPos.isEqual(new Utils.Vec2(0, 0))).toBe(true);
});

test('action - move left - reward = 0, position is right', () => {
    const result = game.step('Right');

    expect(result.reward).toBe(0);
    expect(result.newState.playerPos.isEqual(new Utils.Vec2(1, 0))).toBe(true);
});

test('reach terminal state', () => {
    const queueOfActions: string[] = [
        'Right',
        'Right',
        'Right',
        'Right',
        'Down',
        'Down',
        'Down',
        'Down',
        'Down',
        'Right',
        'Down',
        'Down',
        'Left',
    ];

    for (const action of queueOfActions) {
        game.step(<any>action);
    }

    expect(game.isTerminal).toBe(true);
    expect(game.player.pos.isEqual(new Utils.Vec2(4, 7))).toBe(true);
    expect(game.return).toBe(5);
    expect(game.iteration).toBe(queueOfActions.length);
});

test('reset - new starting position', () => {
    game.step('Down');
    game.reset();

    expect(game.iteration).toBe(0);
    expect(game.player.return).toBe(0);
});

test('state - returns correct state', () => {
    const state = game.state;

    expect(state.playerPos.isEqual(new Utils.Vec2(0, 0))).toBe(true);
    expect(state.goalPos.isEqual(new Utils.Vec2(4, 7))).toBe(true);
});

test('state encoding - returns correct encoding', () => {
    const state = game.state;
    const encoding = Games.GridWorld.Game.encodeStateToIndices(state);

    expect(encoding).toEqual([0, 0, 4, 7]);
});

test('game state dim - expect game state dims to be [10,10,10,10]', () => {
    expect(game.gameStateDim).toEqual([10, 10, 10, 10]);
});
