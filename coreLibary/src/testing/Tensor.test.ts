import { strict as assert } from 'node:assert';
import { describe } from 'mocha';
import { Utils } from '..';

const dims = [4, 6, 8, 7, 2];

describe('Tensor', function () {
    const tensor: Utils.Tensor = Utils.Tensor.Zeros(dims);

    describe('constructor', function () {
        it('error should be thrown when the dimensions on initialization do not match.', function () {
            const wrongDims = [3, 3, 3, 3];
            assert.throws(
                () => new Utils.Tensor(wrongDims, tensor.seeArray),
                Error,
                'The dimension provided has to fit the size of the array'
            );
        });

        it('dimension and array align do no error is thrown', function () {
            assert.doesNotThrow(
                () => new Utils.Tensor(dims, tensor.seeArray),
                Error
            );
        });
    });

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
        const update = Utils.Tensor.Zeros(dims);
        const value = 12;
        const indices: number[] = [3, 5, 2, 1, 1];
        update.set(indices, value);
        it(`The after setting, the value at ${indices} should be ${value}`, function () {
            assert.strictEqual(value, update.get(...indices));
        });
    });

    describe('is equal', function () {
        const original = Utils.Tensor.Random(dims, 12);
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

    describe('validate', function () {
        const original = Utils.Tensor.Random(dims, 12);

        describe('on get', function () {
            it('should throw error', function () {
                const invalidPosition = [1, 1, 1, 1, 1, 1];
                const expectedDims = original.getDim.length;
                const providedDims = invalidPosition.length;

                assert.throws(
                    () => original.get(...invalidPosition),
                    Error,
                    `Tensor has ${expectedDims} dimensions but ${providedDims} indexes where provided`
                );
            });

            it('should throw no error', function () {
                const validPosition = [1, 1, 1, 1];

                assert.doesNotThrow(
                    () => original.get(...validPosition),
                    Error
                );
            });
        });

        describe('on set', function () {
            it('should throw error', function () {
                const invalidPosition = [1, 1, 1, 1, 1, 1];
                const value = 12;
                const expectedDims = original.getDim.length;
                const providedDims = invalidPosition.length;

                assert.throws(
                    () => original.set(invalidPosition, value),
                    Error,
                    `Tensor has ${expectedDims} dimensions but ${providedDims} indexes where provided`
                );
            });

            it('should throw no error', function () {
                const validPosition = [1, 1, 1, 1];
                const value: number[] = [12, 12];

                assert.doesNotThrow(
                    () => original.set(validPosition, value),
                    Error
                );
            });
        });
    });

    describe('correct set dimension', function () {
        const original = Utils.Tensor.Random(dims, 12);

        it('should throw error because the provided array is to small', function () {
            const position = [1, 1, 1, 1];
            const value = 12;
            assert.throws(
                () => original.set(position, value),
                Error,
                'The provided value does not have the same dimension as the element to update'
            );
        });

        it('should throw error because the provided array is to big', function () {
            const position = [1, 1, 1, 1, 1];
            const value = [12, 12];
            assert.throws(
                () => original.set(position, value),
                Error,
                'The provided value does not have the same dimension as the element to update'
            );
        });

        it('should throw no error', function () {
            const position = [1, 1, 1, 1];
            const value = [12, 12];
            assert.doesNotThrow(() => original.set(position, value), Error);
        });
    });

    describe('index out of range error', function () {
        const original = Utils.Tensor.Zeros(dims);
        const invalidIndex = [3, 6, 1, 1, 1];
        const validIndex = [3, 5, 1, 1, 1];

        it('should throw Error', function () {
            assert.throws(
                () => original.get(...invalidIndex),
                Error,
                'The provided Index is out of range'
            );
        });
        it('should throw no Error', function () {
            assert.doesNotThrow(() => original.get(...validIndex), Error);
        });
    });
});

describe('Tensor Zeros', function () {
    const zeros: Utils.Tensor = Utils.Tensor.Zeros(dims);
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
    const ones: Utils.Tensor = Utils.Tensor.Ones(dims);
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
