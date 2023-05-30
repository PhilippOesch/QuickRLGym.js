import { Utils } from '../..';

const referenceDims = [4, 6, 8, 7, 2];
const Tensor = Utils.Tensor;

test('constructor - error thrown when the dimensions on initialization do not match.', () => {
    const wrongDims = [3, 3, 3, 3];
    const wrongDimsTensor = Tensor.Zeros(wrongDims);
    expect(() => {
        new Utils.Tensor(referenceDims, wrongDimsTensor.seeArray);
    }).toThrowError('The dimension provided has to fit the size of the array');
});

test('constructor - dimension and array do align, error is not thrown', () => {
    const referenceTensor = Utils.Tensor.Zeros(referenceDims);
    expect(
        () => new Utils.Tensor(referenceDims, referenceTensor.seeArray)
    ).not.toThrowError();
});

test('copy - copy should be a different reference', () => {
    const testTensors: Utils.Tensor[] = [
        Tensor.Zeros([4, 6, 8, 7, 2]),
        Tensor.Ones([3, 5, 7, 2]),
        Tensor.Random([3, 5, 7, 2, 9, 10], 12),
    ];

    for (const tensor of testTensors) {
        const copy = tensor.copy();
        expect(copy).not.toBe(tensor);
    }
});

test('a copy should be of equal value to the original', () => {
    const testTensors: Utils.Tensor[] = [
        Tensor.Zeros([4, 6, 8, 7, 2]),
        Tensor.Ones([3, 5, 7, 2]),
        Tensor.Random([3, 5, 7, 2, 9, 10], 12),
    ];

    for (let i = 0; i < testTensors.length; i++) {
        const copy = testTensors[i].copy();
        expect(copy).toStrictEqual(testTensors[i]);
    }
});

test('isEqual - tensors are unequal - should return false', () => {
    const comp1: Utils.Tensor[] = [
        Tensor.Zeros([4, 6, 8, 7, 2]),
        Tensor.Ones([3, 5, 7, 2]),
        Tensor.Random([3, 5, 7, 2, 9, 10], 12),
    ];

    const comp2: Utils.Tensor[] = [
        Tensor.Ones([4, 6, 8, 7, 2]),
        Tensor.Ones([3, 5, 7, 2, 1]),
        Tensor.Random([3, 5, 7, 2, 9, 10], 14),
    ];

    for (let i = 0; i < comp1.length; i++) {
        expect(comp1[i].isEqual(comp2[i])).toBe(false);
    }
});

test('isEqual - tensors are equal - should return true', () => {
    const comp1: Utils.Tensor[] = [
        Tensor.Zeros([4, 6, 8, 7, 2]),
        Tensor.Ones([3, 5, 7, 2]),
        Tensor.Random([3, 5, 7, 2, 9, 10], 12),
    ];

    const comp2: Utils.Tensor[] = [
        Tensor.Zeros([4, 6, 8, 7, 2]),
        Tensor.Ones([3, 5, 7, 2]),
        Tensor.Random([3, 5, 7, 2, 9, 10], 12),
    ];

    for (let i = 0; i < comp1.length; i++) {
        expect(comp1[i].isEqual(comp2[i])).toBe(true);
    }
});

test('get value is equal to set value after beeing set', () => {
    const testTensors: Utils.Tensor[] = [
        Tensor.Zeros([4, 6, 8, 7, 2]),
        Tensor.Ones([3, 5, 7, 2]),
        Tensor.Random([3, 5, 7, 2, 9, 10], 12),
    ];

    const testValues: number[] = [12, -5, 0.5];

    const testIndices: number[][] = [
        [3, 5, 2, 1, 1],
        [2, 2, 2, 1],
        [2, 3, 1, 1, 5, 5],
    ];

    for (let i = 0; i < testTensors.length; i++) {
        testTensors[i].set(testIndices[i], testValues[i]);
        expect(testTensors[i].get(...testIndices[i])).toStrictEqual(
            testValues[i]
        );
    }
});

test('validate - dimension of get indices is unequal to expected indice dims - should throw error', () => {
    const tensor = Utils.Tensor.Random([4, 6, 8, 7, 2], 12);
    const invalidPosition = [1, 1, 1, 1, 1, 1];
    const expectedDims = tensor.dim.length;
    const providedDims = invalidPosition.length;

    expect(() => tensor.get(...invalidPosition)).toThrowError(
        `Tensor has ${expectedDims} dimensions but ${providedDims} indexes where provided`
    );
});

test('validate - dimension of get indices is equal to expected indice dims - should throw no error', () => {
    const tensor = Utils.Tensor.Random([4, 6, 8, 7, 2], 12);
    const validPosition = [1, 1, 1, 1];
    const expectedDims = tensor.dim.length;

    expect(() => tensor.get(...validPosition)).not.toThrowError();
});

test('validate - excedes dimension limits on set - throws error', () => {
    const tensor = Utils.Tensor.Random([4, 6, 8, 7, 2], 12);

    const test1Index = [1, 1, 1, 1, 1, 1];
    const test1Value = 12;
    const expectedDims = tensor.dim.length;
    const providedDims = test1Index.length;

    expect(() => tensor.set(test1Index, test1Value)).toThrowError(
        `Tensor has ${expectedDims} dimensions but ${providedDims} indexes where provided`
    );
});

test('validate - does not excede dimension limits on set - throws no error', () => {
    const tensor = Utils.Tensor.Random([4, 6, 8, 7, 2], 12);

    const validPosition = [1, 1, 1, 1];
    const value: number[] = [12, 12];

    expect(() => tensor.set(validPosition, value)).not.toThrowError();
});

test('validate - provided value dimension is to small - throws error', () => {
    const tensor = Utils.Tensor.Random([4, 6, 8, 7, 2], 12);
    const position = [1, 1, 1, 1];
    const value = 12;

    expect(() => tensor.set(position, value)).toThrowError(
        'The provided value does not have the same dimension as the element to update'
    );
});

test('validate - provided value dimension is to big - throws error', () => {
    const tensor = Utils.Tensor.Random([4, 6, 8, 7, 2], 12);
    const test1position = [1, 1, 1, 1, 1];
    const test1Value = [12, 12];

    expect(() => tensor.set(test1position, test1Value)).toThrowError(
        'The provided value does not have the same dimension as the element to update'
    );

    const test2position = [1, 1, 1, 1];
    const test2Value = [12, 12, 12];

    expect(() => tensor.set(test2position, test2Value)).toThrowError(
        'The provided value does not have the same dimension as the element to update'
    );
});

test('validate - index out of range on get - throws error', () => {
    const testTensors: Utils.Tensor[] = [
        Utils.Tensor.Zeros([4, 6, 8, 7, 2]),
        Utils.Tensor.Ones([3, 5, 7, 2]),
        Utils.Tensor.Random([3, 5, 7, 2, 9, 10], 12),
        Utils.Tensor.Random([3, 5, 2, 9, 10], 12),
    ];

    const testIndices: number[][] = [
        [3, 6, 2, 1, 1],
        [2, 2, 8, 1],
        [2, 3, 1, 1, -1, 5],
        [-2, 3, 1, 1, 5],
    ];

    for (let i = 0; i < testTensors.length; i++) {
        expect(() => {
            testTensors[i].get(...testIndices[i]);
        }).toThrowError(`The provided Index is out of range`);
    }
});

test('sum - Returns correct sum', () => {
    const tensors: Utils.Tensor[] = [
        Utils.Tensor.Zeros([4, 6, 8, 7, 2]),
        Utils.Tensor.Ones([4, 6, 8, 7, 2]),
        Utils.Tensor.Random([7, 6, 5, 3], 15),
        new Tensor([0], []),
    ];

    const expectedSums: number[] = [0, 2688, 310.933666, 0];

    for (let i = 0; i < tensors.length; i++) {
        expect(tensors[i].sum).toBeCloseTo(expectedSums[i], 6);
    }
});

test('mean - Returns correct mean', () => {
    const tensors: Utils.Tensor[] = [
        Utils.Tensor.Zeros([4, 6, 8, 7, 2]),
        Utils.Tensor.Ones([4, 6, 8, 7, 2]),
        Utils.Tensor.Random([7, 6, 5, 3], 15),
    ];

    const expectedMeans: number[] = [0, 1, 0.4935455];

    for (let i = 0; i < tensors.length; i++) {
        expect(tensors[i].mean).toBeCloseTo(expectedMeans[i], 6);
    }
});
