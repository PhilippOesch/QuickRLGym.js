import { strict as assert } from 'node:assert';
import { describe } from 'mocha';
import { Games } from '..';

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
    describe('Cards', function () {
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
});
