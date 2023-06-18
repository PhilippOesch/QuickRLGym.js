import { Games } from '../..';

const size = 10;
const randomSeed = 22;
let game: Games.GridWorld.GridWorldGame;

beforeEach(() => {
    game = new Games.GridWorld.GridWorldGame(randomSeed, size);
});

test('print grid world', () => {
    game.print();

    expect(true);
});
