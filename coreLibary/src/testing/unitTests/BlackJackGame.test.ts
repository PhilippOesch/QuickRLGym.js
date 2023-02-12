import { strict as assert } from 'node:assert';
import { describe } from 'mocha';
import { Games, StepResult } from '../../';
import { BlackJackGameState } from '../../Games/BlackJack';

describe('BlackJack', function () {
    const game: Games.BlackJack.BlackJackGame =
        new Games.BlackJack.BlackJackGame();
    const cardJack: Games.BlackJack.BlackJackCard =
        new Games.BlackJack.BlackJackCard('clubs', 13);
    const card5: Games.BlackJack.BlackJackCard =
        new Games.BlackJack.BlackJackCard('hearts', 5);
    const cardAce: Games.BlackJack.BlackJackCard =
        new Games.BlackJack.BlackJackCard('spades', 1);
    const card10: Games.BlackJack.BlackJackCard =
        new Games.BlackJack.BlackJackCard('diamonds', 10);
    const card2: Games.BlackJack.BlackJackCard =
        new Games.BlackJack.BlackJackCard('diamonds', 2);
    const card7: Games.BlackJack.BlackJackCard =
        new Games.BlackJack.BlackJackCard('diamonds', 7);
    const card6: Games.BlackJack.BlackJackCard =
        new Games.BlackJack.BlackJackCard('diamonds', 6);

    describe('Cards', function () {
        it('get correct suit', function () {
            assert.strictEqual(cardJack.getSuit, 'clubs');
            assert.strictEqual(card5.getSuit, 'hearts');
            assert.strictEqual(cardAce.getSuit, 'spades');
            assert.strictEqual(card10.getSuit, 'diamonds');
        });

        it('get correct rank', function () {
            assert.strictEqual(cardJack.getRank, 13);
            assert.strictEqual(card5.getRank, 5);
            assert.strictEqual(cardAce.getRank, 1);
            assert.strictEqual(card10.getRank, 10);
        });

        it('test toString Method', function () {
            assert.strictEqual(cardJack.toString(), 'clubs-13');
            assert.strictEqual(card5.toString(), 'hearts-5');
            assert.strictEqual(cardAce.toString(), 'spades-1');
            assert.strictEqual(card10.toString(), 'diamonds-10');
        });

        it('cards return the correct value', function () {
            assert.strictEqual(10, cardJack.getValue);
            assert.strictEqual(5, card5.getValue);
            assert.strictEqual(1, cardAce.getValue);
            assert.strictEqual(10, card10.getValue);
        });

        it('has usable ace', function () {
            game.reset(false);
            game.getPlayer.addCard(cardAce);
            game.getPlayer.addCard(card10);
            assert.strictEqual(true, game.getPlayer.hasUsableAce);
        });

        it('has no usable ace', function () {
            game.reset(false);
            game.getPlayer.addCard(cardAce);
            game.getPlayer.addCard(card10);
            game.getPlayer.addCard(card5);
            assert.strictEqual(false, game.getPlayer.hasUsableAce);
        });
    });

    describe('Natural BlackJack', function () {
        it('player has natural blackjack and dealer does not', function () {
            game.reset(false);
            game.getPlayer.addCard(cardAce);
            game.getPlayer.addCard(card10);
            game.getPlayer.callStick();
            game.getDealer.addCard(cardAce);
            game.getDealer.addCard(card5);
            game.getDealer.callStick();

            assert.strictEqual(game.getReturn, 1);
        });

        it('player has natural blackjack and dealer does so as well', function () {
            game.reset(false);
            game.getPlayer.addCard(cardAce);
            game.getPlayer.addCard(card10);
            game.getPlayer.callStick();
            game.getDealer.addCard(cardAce);
            game.getDealer.addCard(card10);
            game.getDealer.callStick();

            assert.strictEqual(game.getReturn, 0);
        });
    });

    describe('game ending', function () {
        it('game is over', function () {
            game.reset(false);
            game.getPlayer.callStick();
            game.getDealer.callStick();
            assert.strictEqual(true, game.getIsTerminal);
        });

        it('game is not over', function () {
            game.reset(false);
            game.getPlayer.callStick();
            assert.strictEqual(false, game.getIsTerminal);

            game.reset(false);
            game.getDealer.callStick();
            assert.strictEqual(false, game.getIsTerminal);
        });
    });

    describe('game state', function () {
        const cardAce: Games.BlackJack.BlackJackCard =
            new Games.BlackJack.BlackJackCard('spades', 1);
        const card5: Games.BlackJack.BlackJackCard =
            new Games.BlackJack.BlackJackCard('hearts', 5);

        it('returns correct game state', function () {
            game.reset(false);
            game.getPlayer.addCard(cardAce);
            game.getPlayer.addCard(card5);
            const realState: Games.BlackJack.BlackJackGameState =
                game.getGameState;

            const expectedState: Games.BlackJack.BlackJackGameState = {
                playerScore: 16,
                shownCard: undefined,
                playerHoldsUsableAce: true,
            };

            assert.strictEqual(realState.shownCard, expectedState.shownCard);
            assert.strictEqual(
                realState.playerScore,
                expectedState.playerScore
            );
            assert.strictEqual(
                realState.playerHoldsUsableAce,
                expectedState.playerHoldsUsableAce
            );
        });
    });

    describe('gameplay', function () {
        it('Hit step', function () {
            game.reset(false);
            const result: StepResult = game.step('Hit');
            const newState = <BlackJackGameState>result.newState;

            assert.strictEqual(true, newState.playerScore > 0);
            assert.strictEqual(result.reward, 0);
        });

        it('Stick step', function () {
            game.reset(false);
            const result: StepResult = game.step('Stick');
            const newState = <BlackJackGameState>result.newState;

            assert.strictEqual(0, newState.playerScore);
            assert.strictEqual(result.reward, 0);
        });
    });

    describe('game winner', function () {
        it('player has more points, no one over 21', function () {
            game.reset(false);
            game.getDealer.addCard(card5);
            game.getDealer.addCard(cardAce);
            game.getPlayer.addCard(card10);
            game.getPlayer.addCard(card10);
            game.endGame();
            assert.strictEqual(1, game.getReturn);
        });

        it('player has less points, no one over 21', function () {
            game.reset(false);
            game.getDealer.addCard(card10);
            game.getDealer.addCard(card10);
            game.getPlayer.addCard(card5);
            game.getPlayer.addCard(card10);
            game.endGame();
            assert.strictEqual(-1, game.getReturn);
        });

        it('player has 15 points, dealer over 21', function () {
            game.reset(false);
            game.getDealer.addCard(card10);
            game.getDealer.addCard(card10);
            game.getDealer.addCard(card2);
            game.getPlayer.addCard(card10);
            game.getPlayer.addCard(card5);
            game.endGame();
            assert.strictEqual(1, game.getReturn);
        });

        it('player has 22 points, and dealer 15', function () {
            game.reset(false);
            game.getPlayer.addCard(card10);
            game.getPlayer.addCard(card10);
            game.getPlayer.addCard(card2);
            game.getDealer.addCard(card10);
            game.getDealer.addCard(card5);
            game.endGame();
            assert.strictEqual(-1, game.getReturn);
        });

        it('both over 21', function () {
            game.reset(false);
            game.getDealer.addCard(card10);
            game.getDealer.addCard(card10);
            game.getDealer.addCard(card2);
            game.getPlayer.addCard(card10);
            game.getPlayer.addCard(card10);
            game.getPlayer.addCard(card2);
            game.endGame();
            assert.strictEqual(-1, game.getReturn);
        });

        it('both same points', function () {
            game.reset(false);
            game.getDealer.addCard(card10);
            game.getDealer.addCard(card5);
            game.getDealer.addCard(card2);
            game.getPlayer.addCard(card10);
            game.getPlayer.addCard(card5);
            game.getPlayer.addCard(card2);
            game.endGame();
            assert.strictEqual(0, game.getReturn);
        });
    });

    describe('Dealer', function () {
        it('dealer Hits', function () {
            game.reset(false);
            game.getDealer.addCard(card10);
            game.getDealer.addCard(card6);
            game.getDealer.act();

            assert.strictEqual(true, game.getDealer.getScore > 16);
        });

        it('dealer stick', function () {
            game.reset(false);
            game.getDealer.addCard(card10);
            game.getDealer.addCard(card7);
            game.getDealer.act();

            assert.strictEqual(17, game.getDealer.getScore);
        });
    });
});
