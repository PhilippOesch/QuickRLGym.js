import seedrandom from 'seedrandom';

/**
 * Enum of Initialization Types for a Tensor-Object
 */
enum TensorFillType {
    Zeros,
    Ones,
    Random,
}

export interface JSONTensor {
    dim: number[];
    array: Array<any>;
}

/**
 * Represents a multi dimensional number object
 * @property {number} dim - The dimension of the Tensor
 * @property {Array<any>} array - The actual managed array element
 */
export class Tensor {
    private readonly dim: number[];
    private array: Array<any>;

    public constructor(dim: number[], array: Array<any>) {
        if (!Tensor.isSameDimension(dim, Tensor.getArrayDim(array))) {
            throw new Error(
                'The dimension provided has to fit the size of the array'
            );
        }

        this.dim = dim;
        this.array = array;
    }

    /**
     * Static function to initialize an Tensor filled with Zeros
     * @param {number []} dims - The dimensions of the Tensor to initialize
     * @returns {Tensor} a filled Tensor
     */
    public static Zeros(dims: number[]): Tensor {
        const array = Tensor.init(dims, TensorFillType.Zeros);
        return new Tensor(dims, array);
    }

    public static fromJSONObject(jsonTensor: JSONTensor) {
        return new Tensor(jsonTensor.dim, jsonTensor.array);
    }

    /**
     * Static function to initialize an Tensor filled with Ones
     * @param {number []} dims - The dimensions of the Tensor to initialize
     * @returns {Tensor} a filled Tensor
     */
    public static Ones(dims: number[]): Tensor {
        const array = Tensor.init(dims, TensorFillType.Ones);
        return new Tensor(dims, array);
    }

    /**
     * Static function to initialize an Tensor filled with random number in the range of [0<=x<=1]
     * @param {number []} dims - The dimensions of the Tensor to initialize
     * @param {number} randomSeed - random seed to used for random number generator
     * @returns {Tensor} a filled Tensor
     */
    public static Random(dims: number[], randomSeed?: number): Tensor {
        let rng;
        if (randomSeed != undefined) {
            rng = seedrandom(randomSeed.toString());
        }
        const array = Tensor.init(dims, TensorFillType.Random, rng);
        return new Tensor(dims, array);
    }

    /**
     * Helper function for initializing a tensor
     * @param {number []} dims - The dimensions of the Tensor to initialize
     * @param {TensorFillType} filltype - Type of values to fill the Tensor with
     * @param {seedrandom.PRNG} rng - The random number generator
     * @returns {Array<any>} an initialized array
     */
    private static init(
        dims: number[],
        filltype: TensorFillType = TensorFillType.Zeros,
        rng?: seedrandom.PRNG
    ): Array<any> {
        if (dims.length === 1) {
            return Tensor.fillArray(new Array<number>(dims[0]), filltype, rng);
        }
        let array = new Array(dims[0]);
        const copyDims: number[] = [...dims];
        copyDims.shift();
        for (let i = 0; i < dims[0]; i++) {
            array[i] = Tensor.init(copyDims, filltype, rng);
        }
        return array;
    }

    /**
     * Helper function to fill a one dimentional array on the lowest level
     * @param {number[]} array - The array to fill
     * @param {TensorFillType} fillType - The Type of the values to fill
     * @param {seedrandom.PRNG} rng - The random number generator
     * @returns the filled array
     */
    private static fillArray(
        array: number[],
        fillType: TensorFillType,
        rng?: seedrandom.PRNG
    ): number[] {
        switch (fillType) {
            case TensorFillType.Zeros:
                return array.fill(0);
            case TensorFillType.Ones:
                return array.fill(1);
            case TensorFillType.Random:
                let rngGen = Math.random;
                // use the random number generator when provided
                if (rng != undefined) {
                    rngGen = rng;
                }
                for (let i = 0; i < array.length; i++) {
                    const rand: number = rngGen();
                    array[i] = rand;
                }
                return array;
            default:
                return array;
        }
    }

    /**
     * Get a certain index of the array.
     * @param {number[]} indices - The Tensor index to return
     * @returns {Array<any> | number} The digit or sub array
     */
    public get(...indices: number[]): Array<any> | number {
        this.validate(indices);

        let result = this.array;
        for (const index of indices) {
            result = result[index];
        }
        return result;
    }

    /**
     * Set the value at a certain index
     * @param {number[]} indices - The indices of the position
     * @param {Array<any> | number} value - The new value of the index
     */
    public set(indices: number[], value: Array<any> | number): void {
        this.validate(indices);
        if (!Tensor.isSameDimension(this.get(...indices), value)) {
            throw new Error(
                `The provided value does not have the same dimension as the element to update`
            );
        }
        let updateElement = this.array;
        for (let i = 0; i < indices.length - 1; i++) {
            updateElement = updateElement[indices[i]];
        }
        updateElement[indices[indices.length - 1]] = value;
    }

    /**
     * Validade the indices
     * @param {number[]} indices
     */
    private validate(indices: number[]): void {
        if (indices.length > this.dim.length) {
            throw new Error(
                `Tensor has ${this.dim.length} dimensions but ${indices.length} indexes where provided`
            );
        }
        if (this.indexOutOfRange(indices)) {
            throw new Error(`The provided Index is out of range`);
        }
    }

    /**
     * Check if a provided index is out of range
     * @param indices index array to check
     * @returns true if the index is out of range and otherwise false
     */
    private indexOutOfRange(indices: number[]): boolean {
        for (let i = 0; i < this.dim.length; i++) {
            if (indices[i] >= this.dim[i]) {
                return true;
            }
        }
        return false;
    }

    /**
     * Compare whether to objects have the same dimension
     * @param {any} comp1 - object 1
     * @param {any} comp2 - object 2
     * @returns {boolean} true if both objects have the same dimension
     */
    private static isSameDimension(comp1: any, comp2: any): boolean {
        if (!isNaN(comp1) && !isNaN(comp2)) {
            return true;
        }
        const dimComp1 = Tensor.getArrayDim(comp1);
        const dimComp2 = Tensor.getArrayDim(comp2);
        if (dimComp1.length !== dimComp2.length) {
            return false;
        }
        for (let i = 0; i < dimComp1.length; i++) {
            if (dimComp1[i] !== dimComp2[i]) {
                return false;
            }
        }
        return true;
    }

    /**
     * Returns the dimension of the array
     * @param {Array<any>} array - The array
     * @returns {number []} Returns the dimensions of the array
     */
    private static getArrayDim(array: Array<any>): number[] {
        let dim: number[] = [];
        let currentArray: any = array;
        if (array == undefined) {
            return dim;
        }
        while (currentArray[0] != undefined) {
            dim.push(currentArray.length);
            currentArray = currentArray[0];
        }
        return dim;
    }

    /**
     * Create a copy of the Tensor
     * @returns {Tensor} The copy
     */
    public copy(): Tensor {
        const copy = this.recCopy(this.array);
        return new Tensor([...this.dim], copy);
    }

    /**
     *
     * @returns a copy of just the inner array
     */
    public get seeArray(): Array<any> {
        return this.recCopy(this.array);
    }

    /**
     * @returns {JSONTensor} The Tensor in JSONTensor Format
     */
    public toJSONTensor(): JSONTensor {
        return {
            dim: this.dim,
            array: this.array,
        };
    }

    /**
     * Get the total size of the tensor
     * @returns {number} The size
     */
    public get size(): number {
        return this.dim.reduce((a, b) => a * b);
    }

    public isEqual(comp: Tensor): boolean {
        if (comp === undefined) return false;

        return Tensor.recIsEqual(this.array, comp.array);
    }

    private static recIsEqual(comp1: Array<any>, comp2: Array<any>): boolean {
        if (
            (isNaN(comp1[0]) && !isNaN(comp2[0])) ||
            (!isNaN(comp1[0]) && isNaN(comp2[0]))
        )
            return false;

        if (comp1.length !== comp2.length) return false;

        if (!isNaN(comp1[0]) && !isNaN(comp2[0])) {
            for (let i = 0; i < comp1.length; i++) {
                if (comp1[i] !== comp2[i]) return false;
            }
            return true;
        }

        for (let i = 0; i < comp1.length; i++) {
            if (!Tensor.recIsEqual(comp1[i], comp2[i])) return false;
        }

        return true;
    }

    /**
     * Get the total sum of the tensor
     * @returns {number} The sum
     */
    public get sum(): number {
        return this.array.flat(this.dim.length).reduce((a, b) => a + b);
    }

    /**
     * Helper function for recursively copying an array
     * @param {Array<any>} array - The sub array
     * @returns {Array<any> } The copy
     */
    private recCopy(array: Array<any>): Array<any> {
        if (!isNaN(array[0])) {
            return [...array];
        }
        let copy = new Array(array.length);
        for (let i = 0; i < array.length; i++) {
            copy[i] = this.recCopy(array[i]);
        }
        return copy;
    }

    /**
     * Returns the Tensor as a string object
     * @returns {string} The stringified Tensor
     */
    public toString(): string {
        return `Tensor(${this.array.toString()})`;
    }

    /**
     * Returns the Mean of the Tensor
     * @returns {number} The mean
     */
    public get mean(): number {
        return this.sum / this.size;
    }

    /**
     * Returns the Dimension of the Tensor
     * @returns {number[]} The mean
     */
    public get getDim(): number[] {
        return this.dim;
    }
}
