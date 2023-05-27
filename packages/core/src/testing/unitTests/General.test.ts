import { strict as assert } from 'node:assert';
import { describe } from 'mocha';
import seedrandom from 'seedrandom';
import { Utils } from '../../index';

describe('General', function () {
    describe('shuffleArray', function () {
        it('test shuffle with random seed 20', function () {
            const rng = seedrandom('20');

            const array = [
                83, 54, 35, 79, 38, 53, 74, 98, 16, 18, 54, 5, 43, 60, 58, 66,
                31, 63, 50, 2, 62, 56, 73, 53, 82, 27, 79, 14, 72, 50, 98, 47,
                43, 88, 50, 69, 8, 79, 41, 84, 25, 36, 0, 95, 79, 6, 54, 20, 9,
                79,
            ];
            const expectedShuffledArray = [
                54, 36, 50, 16, 25, 5, 79, 54, 58, 66, 35, 53, 18, 79, 41, 95,
                79, 43, 53, 79, 62, 54, 63, 98, 88, 47, 27, 14, 82, 6, 98, 20,
                50, 8, 60, 0, 31, 2, 79, 50, 73, 69, 84, 72, 83, 74, 56, 43, 38,
                9,
            ];

            const shuffledArray = Utils.General.shuffleArray(array, rng);
            assert.deepStrictEqual(shuffledArray, expectedShuffledArray);
        });
    });

    describe('sampleN', function () {
        it('test sampling with random seed 25', function () {
            const rng = seedrandom('25');

            const n = 10;
            const array = [
                83, 54, 35, 79, 38, 53, 74, 98, 16, 18, 54, 5, 43, 60, 58, 66,
                31, 63, 50, 2, 62, 56, 73, 53, 82, 27, 79, 14, 72, 50, 98, 47,
                43, 88, 50, 69, 8, 79, 41, 84, 25, 36, 0, 95, 79, 6, 54, 20, 9,
                79,
            ];

            const expectedSample = [56, 20, 79, 79, 54, 43, 88, 18, 43, 74];
            const sample = Utils.General.sampleN(array, n, rng);
            assert.deepStrictEqual(sample, expectedSample);
        });
    });

    describe('decayEpsilon', function () {
        it('test core decayEpsilon Functionality', function () {
            const step = 6;
            const epsilonEnd = 0.1;
            const epsilonStart = 1;
            const decaySteps = 9;

            const { epsilon, stepCount } = Utils.General.linearDecayEpsilon(
                step,
                decaySteps,
                epsilonStart,
                epsilonEnd
            );

            assert.strictEqual(stepCount, 7);
            assert.strictEqual(true, Math.abs(0.3 - epsilon) < 0.000000001);
        });

        it('reached epsilon end', function () {
            const step = 9;
            const epsilonEnd = 0.1;
            const epsilonStart = 1;
            const decaySteps = 9;

            const { epsilon, stepCount } = Utils.General.linearDecayEpsilon(
                step,
                decaySteps,
                epsilonStart,
                epsilonEnd
            );

            assert.strictEqual(stepCount, 10);
            assert.strictEqual(epsilon, 0.1);
        });
    });
});
