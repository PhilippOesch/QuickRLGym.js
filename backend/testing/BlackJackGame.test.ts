import { strict as assert } from 'node:assert';
import { describe } from 'mocha';
import { BlackJackCard } from '../../shared/src/Games/BlackJack';

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
});
