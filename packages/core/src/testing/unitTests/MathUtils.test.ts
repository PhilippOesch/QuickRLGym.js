import { strict as assert } from 'node:assert';
import { describe } from 'mocha';
import { Utils } from '../../index';

describe('MathUtils', function () {
    describe('argMax', function () {
        it('test arg Max results', function () {
            const test1 = [3, 5, 13, 7, 8, -3];
            const test2 = [20, 12, 11, 7, 6, 5, 3];
            const test3 = [-30, -20, -25, -4, -10];

            const test1Res = 2;
            const test2Res = 0;
            const test3Res = 3;

            assert.strictEqual(Utils.MathUtils.argMax(test1), test1Res);
            assert.strictEqual(Utils.MathUtils.argMax(test2), test2Res);
            assert.strictEqual(Utils.MathUtils.argMax(test3), test3Res);
        });

        it('empty array', function () {
            const test: number[] = [];
            const res = -1;

            assert.strictEqual(Utils.MathUtils.argMax(test), res);
        });
    });
});
