import { strict as assert } from 'node:assert';
import { describe } from 'mocha';
import { Games, Utils, StepResult } from '../../index';
import seedrandom from 'seedrandom';

describe('TaxiGame', function () {
    const game: Games.Taxi.TaxiGame = new Games.Taxi.TaxiGame();
    game.initGame();
    describe('initial State', function () {
        const initialState: Games.Taxi.TaxiGameState = {
            playerPos: new Utils.Vec2(2, 3),
            destinationIdx: 0,
            customerPosIdx: 2,
        };
        game.reset(true, initialState);
        it('check initial Game state', function () {
            const state = game.gameState as Games.Taxi.TaxiGameState;
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
            const encoding = Games.Taxi.TaxiGame.encodeStateToIndices(
                game.gameState
            );
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
                const gameState = game.gameState as Games.Taxi.TaxiGameState;
                assert.notStrictEqual(gameState.customerPosIdx, 4);
            }
        });
    });

    describe('Movement pos (0, 1)', function () {
        const initialState: Games.Taxi.TaxiGameState = {
            playerPos: new Utils.Vec2(0, 1),
            destinationIdx: 0,
            customerPosIdx: 2,
        };
        it('move left and hit wall', function () {
            game.reset(true, initialState);
            const stepResult = game.step('Left') as StepResult;
            const newState = stepResult.newState as Games.Taxi.TaxiGameState;
            assert.strictEqual(stepResult.reward, -1);
            assert.strict(initialState.playerPos.isEqual(newState.playerPos));
        });
        it('move right to (1,1)', function () {
            game.reset(true, initialState);
            const stepResult = game.step('Right') as StepResult;
            const newState = stepResult.newState as Games.Taxi.TaxiGameState;
            assert.strictEqual(stepResult.reward, -1);
            assert.strict(newState.playerPos.isEqual(new Utils.Vec2(1, 1)));
        });
        it('move Up to (0,0)', function () {
            game.reset(true, initialState);
            const stepResult = game.step('Up') as StepResult;
            const newState = stepResult.newState as Games.Taxi.TaxiGameState;
            assert.strictEqual(stepResult.reward, -1);
            assert.strict(newState.playerPos.isEqual(new Utils.Vec2(0, 0)));
        });
        it('move Down to (0,2)', function () {
            game.reset(true, initialState);
            const stepResult = game.step('Down') as StepResult;
            const newState = stepResult.newState as Games.Taxi.TaxiGameState;
            assert.strictEqual(stepResult.reward, -1);
            assert.strict(newState.playerPos.isEqual(new Utils.Vec2(0, 2)));
        });
    });

    describe('pickup', function () {
        it('successfull pickup', function () {
            const initialState: Games.Taxi.TaxiGameState = {
                playerPos: new Utils.Vec2(0, 0),
                destinationIdx: 1,
                customerPosIdx: 0,
            };
            game.reset(true, initialState);
            const stepResult = game.step('PickUp') as StepResult;
            const newState = stepResult.newState as Games.Taxi.TaxiGameState;
            assert.strictEqual(stepResult.reward, -1);
            assert.strict(newState.playerPos.isEqual(initialState.playerPos));
        });

        it('unsuccessfull pickup', function () {
            const initialState: Games.Taxi.TaxiGameState = {
                playerPos: new Utils.Vec2(0, 3),
                destinationIdx: 1,
                customerPosIdx: 0,
            };
            game.reset(true, initialState);
            const stepResult = game.step('PickUp') as StepResult;
            const newState = stepResult.newState as Games.Taxi.TaxiGameState;
            assert.strictEqual(stepResult.reward, -10);
            assert.strict(newState.playerPos.isEqual(initialState.playerPos));
        });
    });

    describe('dropoff', function () {
        it('successfull dropoff', function () {
            const initialState: Games.Taxi.TaxiGameState = {
                playerPos: new Utils.Vec2(0, 4),
                destinationIdx: 1,
                customerPosIdx: 4,
            };
            game.reset(true, initialState);
            const stepResult = game.step('DropOff') as StepResult;
            const newState = stepResult.newState as Games.Taxi.TaxiGameState;
            assert.strictEqual(stepResult.reward, 20);
            assert.strict(newState.playerPos.isEqual(initialState.playerPos));
        });

        it('unsuccessfull dropoff', function () {
            const initialState: Games.Taxi.TaxiGameState = {
                playerPos: new Utils.Vec2(0, 3),
                destinationIdx: 1,
                customerPosIdx: 0,
            };
            game.reset(true, initialState);
            const stepResult = game.step('DropOff') as StepResult;
            const newState = stepResult.newState as Games.Taxi.TaxiGameState;
            assert.strictEqual(stepResult.reward, -10);
            assert.strict(newState.playerPos.isEqual(initialState.playerPos));
        });
    });

    describe('totalGame Iteration', function () {
        const game: Games.Taxi.TaxiGame = new Games.Taxi.TaxiGame();
        game.initGame();
        const initialState: Games.Taxi.TaxiGameState = {
            playerPos: new Utils.Vec2(0, 1),
            destinationIdx: 1,
            customerPosIdx: 0,
        };
        game.reset(true, initialState);
        game.step('Up');
        game.step('PickUp');
        game.step('Down');
        game.step('Down');
        game.step('Down');
        game.step('Down');
        game.step('DropOff');
        it('check game termination', function () {
            assert.strict(game.isTerminal);
        });
        it('check end points', function () {
            assert.strictEqual(game.return, 14);
        });
    });

    describe('TaxiUtils', function () {
        describe('adjustedToAbsPos', function () {
            it('positions are correctly asjusted', function () {
                const test1 = new Utils.Vec2(2, 2);
                const test2 = new Utils.Vec2(1, 2);
                const test3 = new Utils.Vec2(3, 5);

                const res1 = new Utils.Vec2(352, 224);
                const res2 = new Utils.Vec2(224, 224);
                const res3 = new Utils.Vec2(480, 416);

                assert.strictEqual(
                    true,
                    res1.isEqual(Games.Taxi.TaxiUtils.adjustedToAbsPos(test1))
                );
                assert.strictEqual(
                    true,
                    res2.isEqual(Games.Taxi.TaxiUtils.adjustedToAbsPos(test2))
                );
                assert.strictEqual(
                    true,
                    res3.isEqual(Games.Taxi.TaxiUtils.adjustedToAbsPos(test3))
                );
            });
        });

        describe('checkIfPositionIsDestination', function () {
            it('should be destinations', function () {
                const test1 = new Utils.Vec2(0, 0);
                const test2 = new Utils.Vec2(0, 4);
                const test3 = new Utils.Vec2(4, 0);
                const test4 = new Utils.Vec2(3, 4);

                assert.strictEqual(
                    true,
                    Games.Taxi.TaxiUtils.checkIfPositionIsDestination(test1)
                );
                assert.strictEqual(
                    true,
                    Games.Taxi.TaxiUtils.checkIfPositionIsDestination(test2)
                );
                assert.strictEqual(
                    true,
                    Games.Taxi.TaxiUtils.checkIfPositionIsDestination(test3)
                );
                assert.strictEqual(
                    true,
                    Games.Taxi.TaxiUtils.checkIfPositionIsDestination(test4)
                );
            });

            it('should not be destinations', function () {
                const test1 = new Utils.Vec2(1, 2);
                const test2 = new Utils.Vec2(2, 4);
                const test3 = new Utils.Vec2(3, 3);

                assert.strictEqual(
                    false,
                    Games.Taxi.TaxiUtils.checkIfPositionIsDestination(test1)
                );
                assert.strictEqual(
                    false,
                    Games.Taxi.TaxiUtils.checkIfPositionIsDestination(test2)
                );
                assert.strictEqual(
                    false,
                    Games.Taxi.TaxiUtils.checkIfPositionIsDestination(test3)
                );
            });
        });

        describe('getRandomPosition', function () {
            const rngTest1 = seedrandom('30');
            const rngTest2 = seedrandom('32');
            const rngTest3 = seedrandom('34');

            const res1 = new Utils.Vec2(1, 4);
            const res2 = new Utils.Vec2(3, 0);
            const res3 = new Utils.Vec2(1, 2);

            assert.strictEqual(
                true,
                Games.Taxi.TaxiUtils.getRandomPosition(rngTest1).isEqual(res1)
            );
            assert.strictEqual(
                true,
                Games.Taxi.TaxiUtils.getRandomPosition(rngTest2).isEqual(res2)
            );
            assert.strictEqual(
                true,
                Games.Taxi.TaxiUtils.getRandomPosition(rngTest3).isEqual(res3)
            );
        });
    });
});
