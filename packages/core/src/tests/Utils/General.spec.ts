import seedrandom from 'seedrandom';
import { Utils } from '../../';

const shuffleArray = Utils.General.shuffleArray;
const sampleN = Utils.General.sampleN;
const linearDecayEpsilon = Utils.General.linearDecayEpsilon;

test('shuffleArray - array shuffled correctly', () => {
    const rng = seedrandom('20');

    const array = [
        83, 54, 35, 79, 38, 53, 74, 98, 16, 18, 54, 5, 43, 60, 58, 66, 31, 63,
        50, 2, 62, 56, 73, 53, 82, 27, 79, 14, 72, 50, 98, 47, 43, 88, 50, 69,
        8, 79, 41, 84, 25, 36, 0, 95, 79, 6, 54, 20, 9, 79,
    ];
    const expectedShuffledArray = [
        54, 36, 50, 16, 25, 5, 79, 54, 58, 66, 35, 53, 18, 79, 41, 95, 79, 43,
        53, 79, 62, 54, 63, 98, 88, 47, 27, 14, 82, 6, 98, 20, 50, 8, 60, 0, 31,
        2, 79, 50, 73, 69, 84, 72, 83, 74, 56, 43, 38, 9,
    ];

    expect(shuffleArray(array, rng)).toStrictEqual(expectedShuffledArray);
});

test('sampleN', () => {
    const rng = seedrandom('25');

    const n = 10;
    const array = [
        83, 54, 35, 79, 38, 53, 74, 98, 16, 18, 54, 5, 43, 60, 58, 66, 31, 63,
        50, 2, 62, 56, 73, 53, 82, 27, 79, 14, 72, 50, 98, 47, 43, 88, 50, 69,
        8, 79, 41, 84, 25, 36, 0, 95, 79, 6, 54, 20, 9, 79,
    ];

    const expectedSample = [56, 20, 79, 79, 54, 43, 88, 18, 43, 74];
    const sample = sampleN(array, n, rng);

    expect(sample).toStrictEqual(expectedSample);
});

test('decayEpsilon 1 - returns correct stepCount and epsilon when maximum steps are reached', () => {
    const step = 6;
    const epsilonEnd = 0.1;
    const epsilonStart = 1;
    const decaySteps = 9;

    const { epsilon, stepCount } = linearDecayEpsilon(
        step,
        decaySteps,
        epsilonStart,
        epsilonEnd
    );

    expect(stepCount).toBe(7);
    expect(epsilon).toBeCloseTo(0.3, 5);
});

test('decayEpsilon 2 - returns correct stepCount and epsilon', () => {
    const step = 9;
    const epsilonEnd = 0.1;
    const epsilonStart = 1;
    const decaySteps = 9;

    const { epsilon, stepCount } = linearDecayEpsilon(
        step,
        decaySteps,
        epsilonStart,
        epsilonEnd
    );

    expect(stepCount).toBe(10);
    expect(epsilon).toBeCloseTo(0.1);
});
