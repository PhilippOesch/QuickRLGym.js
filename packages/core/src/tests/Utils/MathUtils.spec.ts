import { Utils } from '../../';

const argMax = Utils.MathUtils.argMax;
const sum = Utils.MathUtils.sum;

test('argMax - filled array returns correct index', () => {
    const testData: number[][] = [
        [3, 5, 13, 7, 8, -3],
        [20, 12, 11, 7, 6, 5, 3],
        [-30, -20, -25, -4, -10],
    ];
    const expectedData: number[] = [2, 0, 3];

    for (let i = 0; i < testData.length; i++) {
        expect(argMax(testData[i])).toStrictEqual(expectedData[i]);
    }
});

test('argMax - empty array returns minus one', () => {
    const test: number[] = [];
    const res = -1;
    expect(argMax(test)).toBe(res);
});

test('sum - array returns correct sum', () => {
    const testData: number[][] = [
        [3, 5, 13, 7, 8, -3],
        [20, 12, 11, 7, 6, 5, 3],
        [-30, -20, -25, -4, -10],
    ];

    const expectedData: number[] = [33, 64, -89];

    for (let i = 0; i < testData.length; i++) {
        expect(sum(testData[i])).toStrictEqual(expectedData[i]);
    }
});
