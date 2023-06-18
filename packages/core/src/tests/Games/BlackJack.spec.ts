import { Games, StepResult } from '../..';

let _game: Games.BlackJack.BlackJackGame;
const randomSeed = 16;

const cards = {
    cardJack: new Games.BlackJack.BlackJackCard('clubs', 13),
    card5: new Games.BlackJack.BlackJackCard('hearts', 5),
    cardAce: new Games.BlackJack.BlackJackCard('spades', 1),
    card10: new Games.BlackJack.BlackJackCard('diamonds', 10),
    card2: new Games.BlackJack.BlackJackCard('diamonds', 2),
    card7: new Games.BlackJack.BlackJackCard('diamonds', 7),
    card6: new Games.BlackJack.BlackJackCard('diamonds', 6),
};

beforeEach(() => {
    _game = new Games.BlackJack.BlackJackGame(randomSeed);
});

test('get the correct suit', () => {
    const expectedSuits = [
        'clubs',
        'hearts',
        'spades',
        'diamonds',
        'diamonds',
        'diamonds',
        'diamonds',
    ];

    let i = 0;
    for (let card of Object.values(cards)) {
        expect(card.suit).toBe(expectedSuits[i]);
        i++;
    }
});

test('get the correct suit', () => {
    const expectedRank = [13, 5, 1, 10, 2, 7, 6];

    let i = 0;
    for (let card of Object.values(cards)) {
        expect(card.rank).toBe(expectedRank[i]);
        i++;
    }
});

test('get the correct suit', () => {
    const expectedString = [
        'clubs-13',
        'hearts-5',
        'spades-1',
        'diamonds-10',
        'diamonds-2',
        'diamonds-7',
        'diamonds-6',
    ];

    let i = 0;
    for (let card of Object.values(cards)) {
        expect(card.toString()).toBe(expectedString[i]);
        i++;
    }
});

test('get the correct suit', () => {
    const expectedValue = [10, 5, 1, 10, 2, 7, 6];

    let i = 0;
    for (let card of Object.values(cards)) {
        expect(card.value).toBe(expectedValue[i]);
        i++;
    }
});

test('player has usable ace', () => {
    _game.reset(false);
    _game.player.addCard(cards.cardAce);
    _game.player.addCard(cards.card10);

    expect(_game.player.hasUsableAce).toBe(true);
});

test('player has no usable ace', () => {
    _game.reset(false);
    _game.player.addCard(cards.cardAce);
    _game.player.addCard(cards.card10);
    _game.player.addCard(cards.card5);

    expect(_game.player.hasUsableAce).toBe(false);
});

test('player has natural blackjack and dealer does not', () => {
    _game.reset(false);
    _game.player.addCard(cards.cardAce);
    _game.player.addCard(cards.card10);
    _game.player.callStick();
    _game.dealer.addCard(cards.cardAce);
    _game.dealer.addCard(cards.card5);
    _game.dealer.callStick();

    expect(_game.return).toBe(1);
});

test('player has natural blackjack and dealer does so as well', () => {
    _game.reset(false);
    _game.player.addCard(cards.cardAce);
    _game.player.addCard(cards.card10);
    _game.player.callStick();
    _game.dealer.addCard(cards.cardAce);
    _game.dealer.addCard(cards.card10);
    _game.dealer.callStick();

    expect(_game.return).toBe(0);
});

test('game ending - game is over', () => {
    _game.reset(false);
    _game.player.callStick();
    _game.dealer.callStick();

    expect(_game.isTerminal).toBe(true);
});

test('game ending - game is not over', () => {
    _game.reset(false);
    _game.player.callStick();
    expect(_game.isTerminal).toBe(false);

    _game.reset(false);
    _game.dealer.callStick();
    expect(_game.isTerminal).toBe(false);
});

test('gameplay - hit step', () => {
    _game.reset(false);
    const result = _game.step('Hit');
    const newState = result.newState;

    expect(newState.playerScore).toBeGreaterThan(0);
});

test('gameplay - Stick step', () => {
    _game.reset(false);
    const result = _game.step('Stick');
    const newState = result.newState;

    expect(newState.playerScore).toBe(0);
});

test('game winner - player has more points, no one over 21', () => {
    _game.reset(false);
    _game.dealer.addCard(cards.card5);
    _game.dealer.addCard(cards.cardAce);
    _game.player.addCard(cards.card10);
    _game.player.addCard(cards.card10);
    _game.endGame();

    expect(_game.return).toBe(1);
});

test('game winner - player has less points, no one over 21', () => {
    _game.reset(false);
    _game.dealer.addCard(cards.card10);
    _game.dealer.addCard(cards.card10);
    _game.player.addCard(cards.card5);
    _game.player.addCard(cards.card10);
    _game.endGame();

    expect(_game.return).toBe(-1);
});

test('game winner - player has 15 points, dealer over 21', () => {
    _game.reset(false);
    _game.dealer.addCard(cards.card10);
    _game.dealer.addCard(cards.card10);
    _game.dealer.addCard(cards.card2);
    _game.player.addCard(cards.card10);
    _game.player.addCard(cards.card5);
    _game.endGame();

    expect(_game.return).toBe(1);
});

test('game winner - both over 21', () => {
    _game.reset(false);
    _game.dealer.addCard(cards.card10);
    _game.dealer.addCard(cards.card10);
    _game.dealer.addCard(cards.card2);
    _game.player.addCard(cards.card10);
    _game.player.addCard(cards.card10);
    _game.player.addCard(cards.card2);
    _game.endGame();

    expect(_game.return).toBe(-1);
});

test('game winner - both same points', () => {
    _game.reset(false);
    _game.dealer.addCard(cards.card10);
    _game.dealer.addCard(cards.card5);
    _game.dealer.addCard(cards.card2);
    _game.player.addCard(cards.card10);
    _game.player.addCard(cards.card5);
    _game.player.addCard(cards.card2);
    _game.endGame();

    expect(_game.return).toBe(0);
});

test('Dealer - dealer should Hit', () => {
    _game.reset(false);
    _game.dealer.addCard(cards.card10);
    _game.dealer.addCard(cards.card6);
    _game.dealer.act();

    expect(_game.dealer.score).toBeGreaterThan(16);
});

test('Dealer - dealer should Stick', () => {
    _game.reset(false);
    _game.dealer.addCard(cards.card10);
    _game.dealer.addCard(cards.card7);
    _game.dealer.act();

    expect(_game.dealer.score).toBe(17);
});
