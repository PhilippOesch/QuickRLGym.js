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
    const newState = <Games.Taxi.TaxiGameState>stepResult.newState;
    expect(stepResult.reward).toBe(-1);
    expect(newState.playerPos.isEqual(new Utils.Vec2(1, 1))).toBe(true);
});

test('movement from position (0,1)- move up - new position (0,0)', () => {
    _game.reset(true, position_01);
    const stepResult = _game.step('Up');
    const newState = <Games.Taxi.TaxiGameState>stepResult.newState;
    expect(stepResult.reward).toBe(-1);
    expect(newState.playerPos.isEqual(new Utils.Vec2(0, 0))).toBe(true);
});

test('movement from position (0,1)- move up - new position (0,2)', () => {
    _game.reset(true, position_01);
    const stepResult = _game.step('Down');
    const newState = <Games.Taxi.TaxiGameState>stepResult.newState;
    expect(stepResult.reward).toBe(-1);
    expect(newState.playerPos.isEqual(new Utils.Vec2(0, 2))).toBe(true);
});
