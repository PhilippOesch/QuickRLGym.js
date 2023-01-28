import { strict as assert } from 'node:assert';
import { describe } from 'mocha';
import { Utils } from '..';

const dims = [4, 6, 8, 7, 2];

describe('Tensor', function () {
    const tensor: Utils.Tensor = Utils.Tensor.Zeros(...dims);

    describe('size', function () {
        const expected: number = dims.reduce((a, b) => a * b);
        it(`Value should be the result of multiplying the dimension`, function () {
            assert.strictEqual(expected, tensor.size);
        });
    });

    describe('copy', function () {
        const copy: Utils.Tensor = tensor.copy();
        it(`The copy should reference to a different object`, function () {
            assert.notStrictEqual(copy, tensor);
        });
    });

    describe('set get', function () {
        const update = Utils.Tensor.Zeros(...dims);
        const value = 12;
        const indices: number[] = [3, 5, 2, 1, 1];
        update.set(indices, value);
        console.log();
        it(`The after setting, the value at ${indices} should be ${value}`, function () {
            assert.strictEqual(value, update.get(...indices));
        });
    });

    describe('is equal', function () {
        const original = Utils.Tensor.Random(...dims);
        const copy = original.copy();

        it(`The copy of an object should be of equal value to the original`, function () {
            assert.strictEqual(true, original.isEqual(copy));
        });

        it(`When changing a value inside the copy it should be unequal`, function () {
            const value = 12;
            const indices: number[] = [3, 5, 2, 1, 1];
            copy.set(indices, value);
            assert.strictEqual(false, original.isEqual(copy));
        });
    });
});

describe('Tensor Zeros', function () {
    const zeros: Utils.Tensor = Utils.Tensor.Zeros(...dims);
    describe('sum', function () {
        const expected: number = 0;
        it('The sum of Tensor.Zeros should be zero', function () {
            assert.strictEqual(expected, zeros.sum);
        });
    });

    describe('mean', function () {
        const expected: number = 0;
        it('The mean of Tensor.Zeros should be zero', function () {
            assert.strictEqual(expected, zeros.mean);
        });
    });
});

describe('Tensor Ones', function () {
    const ones: Utils.Tensor = Utils.Tensor.Ones(...dims);
    describe('sum', function () {
        const expected: number = dims.reduce((a, b) => a * b);
        it('The sum of Tensor.Zeros should be the size of the Tensor', function () {
            assert.strictEqual(expected, ones.sum);
        });
    });

    describe('mean', function () {
        const expected: number = 1;
        it('The mean of Tensor.Zeros should be one', function () {
            assert.strictEqual(expected, ones.mean);
        });
    });
});
