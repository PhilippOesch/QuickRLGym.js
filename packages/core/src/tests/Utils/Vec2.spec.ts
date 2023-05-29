import { Utils } from '../..';

test('vector Intialization', () => {
    const vector: Utils.Vec2 = new Utils.Vec2(12, -7);

    expect(vector.x).toStrictEqual(12);
    expect(vector.y).toStrictEqual(-7);
});

test('copy is not of same reference', () => {
    const vector: Utils.Vec2 = new Utils.Vec2(4, 6);
    const copy = vector.copy();

    expect(copy).not.toBe(vector);
});

test('copy of vector equals same value', () => {
    const vector: Utils.Vec2 = new Utils.Vec2(5, 1);
    const copy = vector.copy();

    expect(copy.isEqual(vector)).toBeTruthy();
});

test('add return correct value', () => {
    const firstValues: Utils.Vec2[] = [
        new Utils.Vec2(5, 1),
        new Utils.Vec2(2, 2),
        new Utils.Vec2(-4, 6),
        new Utils.Vec2(12, -16),
    ];

    const secondValues: Utils.Vec2[] = [
        new Utils.Vec2(2, 3),
        new Utils.Vec2(1, 11),
        new Utils.Vec2(6, -3),
        new Utils.Vec2(5, 5),
    ];

    // first index= x, second index = y
    const expectedResults: number[][] = [
        [7, 4],
        [3, 13],
        [2, 3],
        [17, -11],
    ];

    for (let i = 0; i < expectedResults.length; i++) {
        firstValues[i].add(secondValues[i]);

        expect(firstValues[i].x).toStrictEqual(expectedResults[i][0]);
        expect(firstValues[i].y).toStrictEqual(expectedResults[i][1]);
    }
});
