import seedrandom from 'seedrandom';
import { MathUtils } from '.';

/**
 * Enum of Initialization Types for a Tensor-Object
 * @readonly
 * @enum
 * @category Utils
 */
enum TensorFillType {
    Zeros,
    Ones,
    Random,
}

/**
 * Tensor converted to JSON
 * @category Utils
 * @property {number[]} dim The dimensions
 * @property {any[]} array array
 */
interface JSONTensor {
    dim: number[];
    array: any[];
}

/**
 * Represents a multi dimensional number object
 * @param {number[]} dim - The dimension of the Tensor
 * @param {any[]} array - The actual managed array element
 * @category Utils
 */
class Tensor {
    private readonly _dim: number[];
    private array: Array<any>;

    /**
     * Static function to initialize an Tensor filled with Zeros
     * @param {number[]} dims - The dimensions of the Tensor to initialize
     * @returns {Tensor} a filled Tensor
     */
    public static Zeros(dims: number[]): Tensor {
        const array = Tensor.init(dims, TensorFillType.Zeros);
        return new Tensor(dims, array);
    }

    /**
     * Static function to initialize an Tensor filled with Ones
     * @param {number[]} dims - The dimensions of the Tensor to initialize
     * @returns {Tensor} a filled Tensor
     */
    public static Ones(dims: number[]): Tensor {
        const array = Tensor.init(dims, TensorFillType.Ones);
        return new Tensor(dims, array);
    }

    /**
     * Static function to initialize an Tensor filled with random number in the range of [0<=x<=1]
     * @param {number[]} dims - The dimensions of the Tensor to initialize
     * @param {?number} randomSeed - random seed to used for random number generator
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
     * Convert JSONTensor to actual Tensor
     * @param {JSONTensor} jsonTensor - json tensor to convert
     * @returns {Tensor} - the converted Tensor
     */
    public static fromJSONObject(jsonTensor: JSONTensor): Tensor {
        if (jsonTensor.dim === undefined || jsonTensor.array === undefined) {
            throw new Error(
                'object is missing important attributes for conversion'
            );
        }
        return new Tensor(jsonTensor.dim, jsonTensor.array);
    }

    /**
     * Returns the Mean of the Tensor
     * @type {number}
     */
    public get mean(): number {
        return this.sum / this.size;
    }

    /**
     * Get the total sum of the tensor
     * @type {number}
     */
    public get sum(): number {
        return this.recSum(this.array);
    }

    /**
     * Returns the Dimension of the Tensor
     * @type {number[]}
     */
    public get dim(): number[] {
        return this._dim;
    }

    /**
     * See the contained array
     * @type {any[]}
     */
    public get seeArray(): Array<any> {
        return <Array<any>>this.recCopy(this.array);
    }

    /**
     * Get the total size of the tensor
     * @type {number}
     */
    public get size(): number {
        if (this._dim === undefined || this._dim.length === 0) {
            return 0;
        }

        let size = 1;
        for (let i = 0; i < this._dim.length; i++) {
            size *= this._dim[i];
        }

        return size;
    }

    public constructor(dim: number[], array: Array<any>) {
        if (!Tensor.isSameDimension(dim, Tensor.getArrayDim(array))) {
            throw new Error(
                'The dimension provided has to fit the size of the array'
            );
        }

        this._dim = dim;
        this.array = array;
    }

    /**
     * Get a certain index of the array.
     * @param {number[]} indices - The Tensor index to return
     * @returns {any[] | number} The digit or sub array
     */
    public get(...indices: number[]): Array<any> | number {
        this.validate(indices);

        let result = this.array;
        for (const index of indices) {
            result = result[index];
        }
        return this.recCopy(result);
    }

    /**
     * Set the value at a certain index
     * @param {number[]} indices - The indices of the position
     * @param {Array<any> | number} value - The new value of the index
     * @returns {void}
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
     * Create a copy of the Tensor
     * @returns {Tensor} The copy
     */
    public copy(): Tensor {
        const copy = <Array<any>>this.recCopy(this.array);
        return new Tensor([...this._dim], copy);
    }

    /**
     * Convert to JSONTensor
     * @returns {JSONTensor} The Tensor in JSONTensor Format
     */
    public toJSONTensor(): JSONTensor {
        return {
            dim: this._dim,
            array: this.array,
        };
    }

    /**
     * is Tensor equal
     * @param {Tensor} comp
     * @returns {boolean} Whether it is equal
     */
    public isEqual(comp: Tensor): boolean {
        if (comp === undefined) return false;

        return Tensor.recIsEqual(this.array, comp.array);
    }

    /**
     * Returns the Tensor as a string object
     * @returns {string} The stringified Tensor
     */
    public toString(): string {
        return `Tensor(${this.array.toString()})`;
    }

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

    private validate(indices: number[]): void {
        if (indices.length > this._dim.length) {
            throw new Error(
                `Tensor has ${this._dim.length} dimensions but ${indices.length} indexes where provided`
            );
        }
        if (this.indexOutOfRange(indices)) {
            throw new Error(`The provided Index is out of range`);
        }
    }

    private indexOutOfRange(indices: number[]): boolean {
        for (let i = 0; i < this._dim.length; i++) {
            if (indices[i] >= this._dim[i]) {
                return true;
            }
        }
        return false;
    }

    private recCopy(array: Array<any> | number): Array<any> | number {
        if (typeof array == 'number') {
            return array;
        }

        if (!isNaN(array[0])) {
            return [...array];
        }
        let copy = new Array(array.length);
        for (let i = 0; i < array.length; i++) {
            copy[i] = this.recCopy(array[i]);
        }
        return copy;
    }

    private recSum(array: any[]): number {
        if (array === undefined || array.length === 0) {
            return 0;
        }

        let sum = 0;
        if (!isNaN(array[0])) {
            sum += MathUtils.sum(array);
            return sum;
        }

        for (let i = 0; i < array.length; i++) {
            sum += this.recSum(array[i]);
        }
        return sum;
    }
}

export { TensorFillType, Tensor, JSONTensor };
