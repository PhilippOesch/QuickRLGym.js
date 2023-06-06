import seedrandom from 'seedrandom';
import { Games, Utils } from '../..';

let _game: Games.Taxi.TaxiGame;
const randomSeed = 15;

const position_01: Games.Taxi.TaxiGameState = {
    playerPos: new Utils.Vec2(0, 1),
    destinationIdx: 0,
    customerPosIdx: 2,
};

beforeEach(() => {
    _game = new Games.Taxi.TaxiGame(randomSeed);
});

test('setting initial game state works as expected', () => {
    const initialState: Games.Taxi.TaxiGameState = {
        playerPos: new Utils.Vec2(2, 3),
        destinationIdx: 0,
        customerPosIdx: 2,
    };
    _game.initGame();
    _game.reset(true, initialState);
    const state = _game.gameState;

    expect(initialState.playerPos.isEqual(state.playerPos)).toBe(true);
    expect(state.destinationIdx).toBe(initialState.destinationIdx);
    expect(state.customerPosIdx).toBe(initialState.customerPosIdx);
});

test('state encoding, expect state to be correctly encoded', () => {
    const testStates: Games.Taxi.TaxiGameState[] = [
        {
            playerPos: new Utils.Vec2(2, 3),
            destinationIdx: 0,
            customerPosIdx: 2,
        },
        {
            playerPos: new Utils.Vec2(1, 1),
            destinationIdx: 3,
            customerPosIdx: 1,
        },
        {
            playerPos: new Utils.Vec2(4, 5),
            destinationIdx: 3,
            customerPosIdx: 4,
        },
    ];

    for (const state of testStates) {
        const encodedState = Games.Taxi.TaxiGame.encodeStateToIndices(state);
        expect(state.playerPos.x).toBe(encodedState[0]);
        expect(state.playerPos.y).toBe(encodedState[1]);
        expect(state.destinationIdx).toBe(encodedState[2]);
        expect(state.customerPosIdx).toBe(encodedState[3]);
    }
});

test('initial state generation - customer is never on the same position as the taxi', () => {
    const episodes = 10;
    for (let i = 0; i < episodes; i++) {
        _game.reset(true);
        const gameState = _game.gameState as Games.Taxi.TaxiGameState;
        expect(gameState.customerPosIdx).not.toBe(4);
    }
});

test('movement from position (0,1)- move left - hit wall', () => {
    _game.reset(true, position_01);
    const stepResult = _game.step('Left');
    const newState = <Games.Taxi.TaxiGameState>stepResult.newState;
    expect(stepResult.reward).toBe(-1);
    expect(position_01.playerPos.isEqual(newState.playerPos)).toBe(true);
});

test('movement from position (0,1)- move right - new position (1,1)', () => {
    _game.reset(true, position_01);
    const stepResult = _game.step('Right');
    const newState = stepResult.newState;
    expect(stepResult.reward).toBe(-1);
    expect(newState.playerPos.isEqual(new Utils.Vec2(1, 1))).toBe(true);
});

test('movement from position (0,1)- move up - new position (0,0)', () => {
    _game.reset(true, position_01);
    const stepResult = _game.step('Up');
    const newState = stepResult.newState;
    expect(stepResult.reward).toBe(-1);
    expect(newState.playerPos.isEqual(new Utils.Vec2(0, 0))).toBe(true);
});

test('movement from position (0,1)- move up - new position (0,2)', () => {
    _game.reset(true, position_01);
    const stepResult = _game.step('Down');
    const newState = stepResult.newState;
    expect(stepResult.reward).toBe(-1);
    expect(newState.playerPos.isEqual(new Utils.Vec2(0, 2))).toBe(true);
});

test('pickup - is succesfull', () => {
    const initialState: Games.Taxi.TaxiGameState = {
        playerPos: new Utils.Vec2(0, 0),
        destinationIdx: 1,
        customerPosIdx: 0,
    };
    _game.reset(true, initialState);
    const stepResult = _game.step('PickUp');
    const newState = stepResult.newState;
    expect(stepResult.reward).toBe(-1);
    expect(newState.playerPos.isEqual(initialState.playerPos)).toBe(true);
});

test('pickup - is unsuccesfull', () => {
    const initialState: Games.Taxi.TaxiGameState = {
        playerPos: new Utils.Vec2(0, 3),
        destinationIdx: 1,
        customerPosIdx: 0,
    };
    _game.reset(true, initialState);
    const stepResult = _game.step('PickUp');
    const newState = stepResult.newState;
    expect(stepResult.reward).toBe(-10);
    expect(newState.playerPos.isEqual(initialState.playerPos)).toBe(true);
});

test('dropoff - is succesfull', () => {
    const initialState: Games.Taxi.TaxiGameState = {
        playerPos: new Utils.Vec2(0, 4),
        destinationIdx: 1,
        customerPosIdx: 4,
    };
    _game.reset(true, initialState);
    const stepResult = _game.step('DropOff');
    const newState = stepResult.newState;
    expect(stepResult.reward).toBe(20);
    expect(newState.playerPos.isEqual(initialState.playerPos)).toBe(true);
});

test('dropoff - is unsuccesfull', () => {
    const initialState: Games.Taxi.TaxiGameState = {
        playerPos: new Utils.Vec2(0, 3),
        destinationIdx: 1,
        customerPosIdx: 4,
    };
    _game.reset(true, initialState);
    const stepResult = _game.step('DropOff');
    const newState = stepResult.newState;
    expect(stepResult.reward).toBe(-10);
    expect(newState.playerPos.isEqual(initialState.playerPos)).toBe(true);
});

test('totalGame Iteration', () => {
    const initialState: Games.Taxi.TaxiGameState = {
        playerPos: new Utils.Vec2(0, 1),
        destinationIdx: 1,
        customerPosIdx: 0,
    };
    _game.reset(true, initialState);
    _game.step('Up');
    _game.step('PickUp');
    _game.step('Down');
    _game.step('Down');
    _game.step('Down');
    _game.step('Down');
    _game.step('DropOff');

    expect(_game.isTerminal).toBe(true);
    expect(_game.return).toBe(14);
});

test('TaxiUtils - adjustToAbsPos - positions are correctly adjusted', () => {
    const testData: Utils.Vec2[] = [
        new Utils.Vec2(2, 2),
        new Utils.Vec2(1, 2),
        new Utils.Vec2(3, 5),
    ];

    const testResult: Utils.Vec2[] = [
        new Utils.Vec2(352, 224),
        new Utils.Vec2(224, 224),
        new Utils.Vec2(480, 416),
    ];

    for (let i = 0; i < testData.length; i++) {
        expect(
            testResult[i].isEqual(
                Games.Taxi.TaxiUtils.adjustedToAbsPos(testData[i])
            )
        ).toBe(true);
    }
});

test('TaxuUtils - checkIfPositionIsDestination - should be destinations', () => {
    const testData: Utils.Vec2[] = [
        new Utils.Vec2(0, 0),
        new Utils.Vec2(0, 4),
        new Utils.Vec2(4, 0),
        new Utils.Vec2(3, 4),
    ];

    for (const vector of testData) {
        expect(Games.Taxi.TaxiUtils.checkIfPositionIsDestination(vector)).toBe(
            true
        );
    }
});

test('TaxiUtils - checkIfPositionIsDestination - should not be destinations', () => {
    const testData: Utils.Vec2[] = [
        new Utils.Vec2(1, 2),
        new Utils.Vec2(2, 4),
        new Utils.Vec2(3, 3),
    ];

    for (const vector of testData) {
        expect(Games.Taxi.TaxiUtils.checkIfPositionIsDestination(vector)).toBe(
            false
        );
    }
});

test('Random Position - getRandomPosition', () => {
    const randomSeeds: string[] = ['30', '32', '34'];

    const testVectors: Utils.Vec2[] = [
        new Utils.Vec2(1, 4),
        new Utils.Vec2(3, 0),
        new Utils.Vec2(1, 2),
    ];

    for (let i = 0; i < randomSeeds.length; i++) {
        expect(
            Games.Taxi.TaxiUtils.getRandomPosition(
                seedrandom(randomSeeds[i])
            ).isEqual(testVectors[i])
        ).toBe(true);
    }
});
