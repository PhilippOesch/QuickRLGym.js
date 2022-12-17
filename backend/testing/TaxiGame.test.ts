import { strict as assert } from 'node:assert';
import { describe } from 'mocha';
import { Vec2, StepResult } from '../../shared/src';
import { TaxiGame, TaxiGameState } from '../../shared/src/Games/TaxiGame';

describe('TaxiGame', function () {
    const game: TaxiGame = new TaxiGame();
    game.initGame();
    describe('initial State', function () {
        const initialState: TaxiGameState = {
            playerPos: new Vec2(2, 3),
            destinationIdx: 0,
            customerPosIdx: 2,
        };
        game.reset(true, initialState);
        it('check initial Game state', function () {
            const state = game.getGameState as TaxiGameState;
            assert.strict(initialState.playerPos.isEqual(state.playerPos));
            assert.strictEqual(
                state.destinationIdx,
                initialState.destinationIdx
            );
            assert.strictEqual(
                state.customerPosIdx,
                initialState.customerPosIdx
            );
        });

        it('check initial Game state index encoding', function () {
            const encoding = game.encodeStateToIndices(game.getGameState);
            assert.strictEqual(encoding[0], initialState.playerPos.getX);
            assert.strictEqual(encoding[1], initialState.playerPos.getY);
            assert.strictEqual(encoding[2], initialState.destinationIdx);
            assert.strictEqual(encoding[3], initialState.customerPosIdx);
        });
    });

    describe('initial State generation', function () {
        const episodes: number = 10;
        it(`The initial customer Position is never 4 (Inside the Taxi) over ${episodes} iterations`, function () {
            for (let i = 0; i < episodes; i++) {
                game.reset(true);
                const gameState = game.getGameState as TaxiGameState;
                assert.notStrictEqual(gameState.customerPosIdx, 4);
            }
        });
    });

    describe('Movement pos (0, 1)', function () {
        const initialState: TaxiGameState = {
            playerPos: new Vec2(0, 1),
            destinationIdx: 0,
            customerPosIdx: 2,
        };
        it('move left and hit wall', function () {
            game.reset(true, initialState);
            const stepResult = game.step('Left') as StepResult;
            const newState = stepResult.newState as TaxiGameState;
            assert.strictEqual(stepResult.reward, -1);
            assert.strict(initialState.playerPos.isEqual(newState.playerPos));
        });
        it('move right to (1,1)', function () {
            game.reset(true, initialState);
            const stepResult = game.step('Right') as StepResult;
            const newState = stepResult.newState as TaxiGameState;
            assert.strictEqual(stepResult.reward, -1);
            assert.strict(newState.playerPos.isEqual(new Vec2(1, 1)));
        });
        it('move Up to (0,0)', function () {
            game.reset(true, initialState);
            const stepResult = game.step('Up') as StepResult;
            const newState = stepResult.newState as TaxiGameState;
            assert.strictEqual(stepResult.reward, -1);
            assert.strict(newState.playerPos.isEqual(new Vec2(0, 0)));
        });
        it('move Down to (0,2)', function () {
            game.reset(true, initialState);
            const stepResult = game.step('Down') as StepResult;
            const newState = stepResult.newState as TaxiGameState;
            assert.strictEqual(stepResult.reward, -1);
            assert.strict(newState.playerPos.isEqual(new Vec2(0, 2)));
        });
    });

    describe('pickup', function () {
        it('successfull pickup', function () {
            const initialState: TaxiGameState = {
                playerPos: new Vec2(0, 0),
                destinationIdx: 1,
                customerPosIdx: 0,
            };
            game.reset(true, initialState);
            const stepResult = game.step('PickUp') as StepResult;
            const newState = stepResult.newState as TaxiGameState;
            assert.strictEqual(stepResult.reward, -1);
            assert.strict(newState.playerPos.isEqual(initialState.playerPos));
        });

        it('unsuccessfull pickup', function () {
            const initialState: TaxiGameState = {
                playerPos: new Vec2(0, 3),
                destinationIdx: 1,
                customerPosIdx: 0,
            };
            game.reset(true, initialState);
            const stepResult = game.step('PickUp') as StepResult;
            const newState = stepResult.newState as TaxiGameState;
            assert.strictEqual(stepResult.reward, -10);
            assert.strict(newState.playerPos.isEqual(initialState.playerPos));
        });
    });

    describe('dropoff', function () {
        it('successfull dropoff', function () {
            const initialState: TaxiGameState = {
                playerPos: new Vec2(0, 4),
                destinationIdx: 1,
                customerPosIdx: 4,
            };
            game.reset(true, initialState);
            const stepResult = game.step('DropOff') as StepResult;
            const newState = stepResult.newState as TaxiGameState;
            assert.strictEqual(stepResult.reward, 20);
            assert.strict(newState.playerPos.isEqual(initialState.playerPos));
        });

        it('unsuccessfull dropoff', function () {
            const initialState: TaxiGameState = {
                playerPos: new Vec2(0, 3),
                destinationIdx: 1,
                customerPosIdx: 0,
            };
            game.reset(true, initialState);
            const stepResult = game.step('DropOff') as StepResult;
            const newState = stepResult.newState as TaxiGameState;
            assert.strictEqual(stepResult.reward, -10);
            assert.strict(newState.playerPos.isEqual(initialState.playerPos));
        });
    });

    describe('totalGame Iteration', function () {
        const game: TaxiGame = new TaxiGame();
        game.initGame();
        const initialState: TaxiGameState = {
            playerPos: new Vec2(0, 1),
            destinationIdx: 1,
            customerPosIdx: 0,
        };
        game.reset(true, initialState);
        game.step('Up') as StepResult;
        game.step('PickUp') as StepResult;
        game.step('Down') as StepResult;
        game.step('Down') as StepResult;
        game.step('Down') as StepResult;
        game.step('Down') as StepResult;
        const stepResult = game.step('DropOff') as StepResult;
        const newState = stepResult.newState as TaxiGameState;
        it('check game termination', function () {
            assert.strict(game.getIsTerminal);
        });
        it('check end points', function () {
            assert.strictEqual(game.getReturn, 14);
        });
    });
});
