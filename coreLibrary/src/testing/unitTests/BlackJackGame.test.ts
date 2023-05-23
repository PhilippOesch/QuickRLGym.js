import { strict as assert } from 'node:assert';
import { describe } from 'mocha';
import { Games, StepResult } from '../..';
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
            assert.strictEqual(cardJack.suit, 'clubs');
            assert.strictEqual(card5.suit, 'hearts');
            assert.strictEqual(cardAce.suit, 'spades');
            assert.strictEqual(card10.suit, 'diamonds');
        });

        it('get correct rank', function () {
            assert.strictEqual(cardJack.rank, 13);
            assert.strictEqual(card5.rank, 5);
            assert.strictEqual(cardAce.rank, 1);
            assert.strictEqual(card10.rank, 10);
        });

        it('test toString Method', function () {
            assert.strictEqual(cardJack.toString(), 'clubs-13');
            assert.strictEqual(card5.toString(), 'hearts-5');
            assert.strictEqual(cardAce.toString(), 'spades-1');
            assert.strictEqual(card10.toString(), 'diamonds-10');
        });

        it('cards return the correct value', function () {
            assert.strictEqual(10, cardJack.value);
            assert.strictEqual(5, card5.value);
            assert.strictEqual(1, cardAce.value);
            assert.strictEqual(10, card10.value);
        });

        it('has usable ace', function () {
            game.reset(false);
            game.player.addCard(cardAce);
            game.player.addCard(card10);
            assert.strictEqual(true, game.player.hasUsableAce);
        });

        it('has no usable ace', function () {
            game.reset(false);
            game.player.addCard(cardAce);
            game.player.addCard(card10);
            game.player.addCard(card5);
            assert.strictEqual(false, game.player.hasUsableAce);
        });
    });

    describe('Natural BlackJack', function () {
        it('player has natural blackjack and dealer does not', function () {
            game.reset(false);
            game.player.addCard(cardAce);
            game.player.addCard(card10);
            game.player.callStick();
            game.dealer.addCard(cardAce);
            game.dealer.addCard(card5);
            game.dealer.callStick();

            assert.strictEqual(game.return, 1);
        });

        it('player has natural blackjack and dealer does so as well', function () {
            game.reset(false);
            game.player.addCard(cardAce);
            game.player.addCard(card10);
            game.player.callStick();
            game.dealer.addCard(cardAce);
            game.dealer.addCard(card10);
            game.dealer.callStick();

            assert.strictEqual(game.return, 0);
        });
    });

    describe('game ending', function () {
        it('game is over', function () {
            game.reset(false);
            game.player.callStick();
            game.dealer.callStick();
            assert.strictEqual(true, game.isTerminal);
        });

        it('game is not over', function () {
            game.reset(false);
            game.player.callStick();
            assert.strictEqual(false, game.isTerminal);

            game.reset(false);
            game.dealer.callStick();
            assert.strictEqual(false, game.isTerminal);
        });
    });

    describe('game state', function () {
        const cardAce: Games.BlackJack.BlackJackCard =
            new Games.BlackJack.BlackJackCard('spades', 1);
        const card5: Games.BlackJack.BlackJackCard =
            new Games.BlackJack.BlackJackCard('hearts', 5);

        it('returns correct game state', function () {
            game.reset(false);
            game.player.addCard(cardAce);
            game.player.addCard(card5);
            const realState: Games.BlackJack.BlackJackGameState =
                game.gameState;

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
        });

        it('Stick step', function () {
            game.reset(false);
            const result: StepResult = game.step('Stick');
            const newState = <BlackJackGameState>result.newState;

            assert.strictEqual(0, newState.playerScore);
        });
    });

    describe('game winner', function () {
        it('player has more points, no one over 21', function () {
            game.reset(false);
            game.dealer.addCard(card5);
            game.dealer.addCard(cardAce);
            game.player.addCard(card10);
            game.player.addCard(card10);
            game.endGame();
            assert.strictEqual(1, game.return);
        });

        it('player has less points, no one over 21', function () {
            game.reset(false);
            game.dealer.addCard(card10);
            game.dealer.addCard(card10);
            game.player.addCard(card5);
            game.player.addCard(card10);
            game.endGame();
            assert.strictEqual(-1, game.return);
        });

        it('player has 15 points, dealer over 21', function () {
            game.reset(false);
            game.dealer.addCard(card10);
            game.dealer.addCard(card10);
            game.dealer.addCard(card2);
            game.player.addCard(card10);
            game.player.addCard(card5);
            game.endGame();
            assert.strictEqual(1, game.return);
        });

        it('player has 22 points, and dealer 15', function () {
            game.reset(false);
            game.player.addCard(card10);
            game.player.addCard(card10);
            game.player.addCard(card2);
            game.dealer.addCard(card10);
            game.dealer.addCard(card5);
            game.endGame();
            assert.strictEqual(-1, game.return);
        });

        it('both over 21', function () {
            game.reset(false);
            game.dealer.addCard(card10);
            game.dealer.addCard(card10);
            game.dealer.addCard(card2);
            game.player.addCard(card10);
            game.player.addCard(card10);
            game.player.addCard(card2);
            game.endGame();
            assert.strictEqual(-1, game.return);
        });

        it('both same points', function () {
            game.reset(false);
            game.dealer.addCard(card10);
            game.dealer.addCard(card5);
            game.dealer.addCard(card2);
            game.player.addCard(card10);
            game.player.addCard(card5);
            game.player.addCard(card2);
            game.endGame();
            assert.strictEqual(0, game.return);
        });
    });

    describe('Dealer', function () {
        it('dealer Hits', function () {
            game.reset(false);
            game.dealer.addCard(card10);
            game.dealer.addCard(card6);
            game.dealer.act();

            assert.strictEqual(true, game.dealer.score > 16);
        });

        it('dealer stick', function () {
            game.reset(false);
            game.dealer.addCard(card10);
            game.dealer.addCard(card7);
            game.dealer.act();

            assert.strictEqual(17, game.dealer.score);
        });
    });
});
