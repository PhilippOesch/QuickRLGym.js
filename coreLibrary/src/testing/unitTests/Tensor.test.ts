import { strict as assert } from 'node:assert';
import { describe } from 'mocha';
import { Utils } from '../..';

const dims = [4, 6, 8, 7, 2];

describe('Tensor', function () {
    //const tensor: Utils.Tensor = Utils.Tensor.Zeros(dims);

    describe('constructor', function () {
        const testTensor: Utils.Tensor = Utils.Tensor.Zeros(dims);
        it('error should be thrown when the dimensions on initialization do not match.', function () {
            const wrongDims = [3, 3, 3, 3];
            assert.throws(
                () => new Utils.Tensor(wrongDims, testTensor.seeArray),
                Error,
                'The dimension provided has to fit the size of the array'
            );
        });

        it('dimension and array do not align, error is thrown', function () {
            assert.doesNotThrow(
                () => new Utils.Tensor(dims, testTensor.seeArray),
                Error
            );
        });
    });

    describe('size', function () {
        const testDims1 = [4, 6, 8, 7, 2];
        const testDims2 = [3, 5, 7, 2];
        const testDims3 = [3, 5, 7, 2, 9, 10];

        const testTensor1 = Utils.Tensor.Zeros(testDims1);
        const testTensor2 = Utils.Tensor.Ones(testDims2);
        const testTensor3 = Utils.Tensor.Random(testDims3, 12);

        // The size of a tensor should be equal to its multiplicated dimensions
        const sum = (array: number[]) => array.reduce((a, b) => a * b);

        it(`Value should be the result of multiplying the dimension`, function () {
            assert.strictEqual(sum(testDims1), testTensor1.size);
            assert.strictEqual(sum(testDims2), testTensor2.size);
            assert.strictEqual(sum(testDims3), testTensor3.size);
        });
    });

    describe('copy', function () {
        const original1 = Utils.Tensor.Zeros([4, 6, 8, 7, 2]);
        const original2 = Utils.Tensor.Ones([3, 5, 7, 2]);
        const original3 = Utils.Tensor.Random([3, 5, 7, 2, 9, 10], 12);
        const copy1: Utils.Tensor = original1.copy();
        const copy2: Utils.Tensor = original2.copy();
        const copy3: Utils.Tensor = original3.copy();
        it(`The copy should reference to a different object`, function () {
            assert.notStrictEqual(copy1, original1);
            assert.notStrictEqual(copy2, original2);
            assert.notStrictEqual(copy3, original3);
        });
    });

    describe('set get', function () {
        const test1Tensor = Utils.Tensor.Zeros([4, 6, 8, 7, 2]);
        const test2Tensor = Utils.Tensor.Ones([3, 5, 7, 2]);
        const test3Tensor = Utils.Tensor.Random([3, 5, 7, 2, 9, 10], 12);

        const test1Value = 12;
        const test2Value = -5;
        const test3Value = 0.5;

        const test1Indices = [3, 5, 2, 1, 1];
        const test2Indices = [2, 2, 2, 1];
        const test3Indices = [2, 3, 1, 1, 5, 5];

        test1Tensor.set(test1Indices, test1Value);
        test2Tensor.set(test2Indices, test2Value);
        test3Tensor.set(test3Indices, test3Value);
        it(`The after setting, the value at the specific index the get method should return this value`, function () {
            assert.strictEqual(test1Value, test1Tensor.get(...test1Indices));
            assert.strictEqual(test2Value, test2Tensor.get(...test2Indices));
            assert.strictEqual(test3Value, test3Tensor.get(...test3Indices));
        });
    });

    describe('is equal', function () {
        const test1Tensor = Utils.Tensor.Zeros([4, 6, 8, 7, 2]);
        const test2Tensor = Utils.Tensor.Ones([3, 5, 7, 2]);
        const test3Tensor = Utils.Tensor.Random([3, 5, 7, 2, 9, 10], 12);
        const copy1 = test1Tensor.copy();
        const copy2 = test2Tensor.copy();
        const copy3 = test3Tensor.copy();

        it(`The copy of an object should be of equal value to the original`, function () {
            assert.strictEqual(true, test1Tensor.isEqual(copy1));
            assert.strictEqual(true, test2Tensor.isEqual(copy2));
            assert.strictEqual(true, test3Tensor.isEqual(copy3));
        });

        it(`When changing a value inside the copy it should be unequal`, function () {
            const test1Value = 12;
            const test2Value = -5;
            const test3Value = 0.5;

            const test1Indices = [3, 5, 2, 1, 1];
            const test2Indices = [2, 2, 2, 1];
            const test3Indices = [2, 3, 1, 1, 5, 5];

            copy1.set(test1Indices, test1Value);
            copy2.set(test2Indices, test2Value);
            copy3.set(test3Indices, test3Value);

            assert.strictEqual(false, test1Tensor.isEqual(copy1));
            assert.strictEqual(false, test2Tensor.isEqual(copy2));
            assert.strictEqual(false, test3Tensor.isEqual(copy3));
        });
    });

    describe('validate', function () {
        describe('on get', function () {
            const tensor = Utils.Tensor.Random([4, 6, 8, 7, 2], 12);

            it('should throw error', function () {
                const invalidPosition = [1, 1, 1, 1, 1, 1];
                const expectedDims = tensor.dim.length;
                const providedDims = invalidPosition.length;

                assert.throws(
                    () => tensor.get(...invalidPosition),
                    Error,
                    `Tensor has ${expectedDims} dimensions but ${providedDims} indexes where provided`
                );
            });

            it('should throw no error', function () {
                const validPosition = [1, 1, 1, 1];

                assert.doesNotThrow(() => tensor.get(...validPosition), Error);
            });
        });

        describe('on set', function () {
            const tensor = Utils.Tensor.Random([4, 6, 8, 7, 2], 12);

            it('should throw error', function () {
                const test1Index = [1, 1, 1, 1, 1, 1];
                const test1Value = 12;
                const expectedDims = tensor.dim.length;
                const providedDims = test1Index.length;

                assert.throws(
                    () => tensor.set(test1Index, test1Value),
                    Error,
                    `Tensor has ${expectedDims} dimensions but ${providedDims} indexes where provided`
                );
            });

            it('should throw no error', function () {
                const validPosition = [1, 1, 1, 1];
                const value: number[] = [12, 12];

                assert.doesNotThrow(
                    () => tensor.set(validPosition, value),
                    Error
                );
            });
        });
    });

    describe('correct set dimension', function () {
        const original = Utils.Tensor.Random([4, 6, 8, 7, 2], 12);

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
            const test1position = [1, 1, 1, 1, 1];
            const test1Value = [12, 12];
            assert.throws(
                () => original.set(test1position, test1Value),
                Error,
                'The provided value does not have the same dimension as the element to update'
            );

            const test2position = [1, 1, 1, 1];
            const test2Value = [12, 12, 12];
            assert.throws(
                () => original.set(test2position, test2Value),
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
        const test1Tensor = Utils.Tensor.Zeros([4, 6, 8, 7, 2]);
        const test2Tensor = Utils.Tensor.Ones([3, 5, 7, 2]);
        const test3Tensor = Utils.Tensor.Random([3, 5, 7, 2, 9, 10], 12);
        const test4Tensor = Utils.Tensor.Random([3, 5, 2, 9, 10], 12);

        const test1Indices = [3, 6, 2, 1, 1];
        const test2Indices = [2, 2, 8, 1];
        const test3Indices = [2, 3, 1, 1, -1, 5];
        const test4Indices = [-2, 3, 1, 1, 5];

        it('should throw Error', function () {
            assert.throws(
                () => test1Tensor.get(...test1Indices),
                Error,
                'The provided Index is out of range'
            );
            assert.throws(
                () => test2Tensor.get(...test2Indices),
                Error,
                'The provided Index is out of range'
            );
            assert.throws(
                () => test3Tensor.get(...test3Indices),
                Error,
                'The provided Index is out of range'
            );
            assert.throws(
                () => test4Tensor.get(...test4Indices),
                Error,
                'The provided Index is out of range'
            );
        });

        const test1IndicesValid = [3, 5, 2, 1, 1];
        const test2IndicesValid = [2, 2, 2, 1];
        const test3IndicesValid = [2, 2, 1, 1, 5];

        it('should throw no Error', function () {
            assert.doesNotThrow(
                () => test1Tensor.get(...test1IndicesValid),
                Error
            );
            assert.doesNotThrow(
                () => test2Tensor.get(...test2IndicesValid),
                Error
            );
            assert.doesNotThrow(
                () => test3Tensor.get(...test3IndicesValid),
                Error
            );
        });
    });
});

describe('Tensor Zeros', function () {
    const zeros: Utils.Tensor = Utils.Tensor.Zeros([4, 6, 8, 7, 2]);
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
    const ones: Utils.Tensor = Utils.Tensor.Ones([4, 6, 8, 7, 2]);
    describe('sum', function () {
        const expected: number = dims.reduce((a, b) => a * b);
        it('The sum of Tensor.Zeros should be equal to the size of the Tensor', function () {
            assert.strictEqual(expected, ones.sum);
        });
    });

    describe('mean', function () {
        const expected: number = 1;
        it('The mean of Tensor.Ones should be equal to one', function () {
            assert.strictEqual(expected, ones.mean);
        });
    });
});
