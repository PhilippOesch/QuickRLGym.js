import { strict as assert } from 'node:assert';
import { describe } from 'mocha';
import {
    BlackJackCard,
    BlackJackGame,
    BlackJackGameState,
} from '../../shared/src/Games/BlackJack';

describe('BlackJack', function () {
    describe('Cards', function () {
        const cardJack: BlackJackCard = new BlackJackCard('Clubs', 'King');
        const card5: BlackJackCard = new BlackJackCard('Hearts', '5');
        const cardAce: BlackJackCard = new BlackJackCard('Spades', 'Ace');
        const card10: BlackJackCard = new BlackJackCard('Diamonds', '10');

        it('cards return the correct value', function () {
            assert.strictEqual(10, cardJack.getValue);
            assert.strictEqual(5, card5.getValue);
            assert.strictEqual(1, cardAce.getValue);
            assert.strictEqual(10, card10.getValue);
        });
    });

    describe('Natural BlackJack', function () {
        const game: BlackJackGame = new BlackJackGame();
        const cardAce: BlackJackCard = new BlackJackCard('Clubs', 'Ace');
        const card10: BlackJackCard = new BlackJackCard('Diamonds', '10');
        const card5: BlackJackCard = new BlackJackCard('Hearts', '5');

        it('player has natural blackjack and dealer does not', function () {
            game.reset();
            game.getPlayer.addCard(cardAce);
            game.getPlayer.addCard(card10);
            game.getPlayer.callStick();
            game.getDealer.addCard(cardAce);
            game.getDealer.addCard(card5);
            game.getDealer.callStick();

            assert.strictEqual(game.getReturn, 1);
        });

        it('player has natural blackjack and dealer does so as well', function () {
            game.reset();
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
        const game: BlackJackGame = new BlackJackGame();

        it('game is over', function () {
            game.reset();
            game.getPlayer.callStick();
            game.getDealer.callStick();
            assert.strictEqual(true, game.getIsTerminal);
        });

        it('game is not over', function () {
            game.reset();
            game.getPlayer.callStick();
            assert.strictEqual(false, game.getIsTerminal);

            game.reset();
            game.getDealer.callStick();
            assert.strictEqual(false, game.getIsTerminal);
        });
    });

    describe('game state', function () {
        const game: BlackJackGame = new BlackJackGame();

        const cardAce: BlackJackCard = new BlackJackCard('Spades', 'Ace');
        const card5: BlackJackCard = new BlackJackCard('Hearts', '5');

        it('returns correct game state', function () {
            game.reset();
            game.getPlayer.addCard(cardAce);
            game.getPlayer.addCard(card5);
            const realState: BlackJackGameState = game.getGameState;

            const expectedState: BlackJackGameState = {
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
});
