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
    private dim: number[];
    private array: Array<any>;

    public constructor(dim: number[], array: Array<any>) {
        this.dim = dim;
        this.array = array;
    }

    /**
     * Static function to initialize an Tensor filled with Zeros
     * @param {number []} dims - The dimensions of the Tensor to initialize
     * @returns {Tensor} a filled Tensor
     */
    public static Zeros(...dims: number[]): Tensor {
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
    public static Ones(...dims: number[]): Tensor {
        const array = Tensor.init(dims, TensorFillType.Ones);
        return new Tensor(dims, array);
    }

    /**
     * Static function to initialize an Tensor filled with random number in the range of [0<=x<=1]
     * @param {number []} dims - The dimensions of the Tensor to initialize
     * @returns {Tensor} a filled Tensor
     */
    public static Random(...dims: number[]): Tensor {
        const array = Tensor.init(dims, TensorFillType.Random);
        return new Tensor(dims, array);
    }

    /**
     * Helper function for initializing a tensor
     * @param {number []} dims - The dimensions of the Tensor to initialize
     * @param {TensorFillType} filltype - Type of values to fill the Tensor with
     * @returns {Array<any>} an initialized array
     */
    private static init(
        dims: number[],
        filltype: TensorFillType = TensorFillType.Zeros
    ): Array<any> {
        if (dims.length === 1) {
            return Tensor.fillArray(new Array<number>(dims[0]), filltype);
        }
        let array = new Array(dims[0]);
        const copyDims: number[] = [...dims];
        copyDims.shift();
        for (let i = 0; i < dims[0]; i++) {
            array[i] = this.init(copyDims, filltype);
        }
        return array;
    }

    /**
     * Helper function to fill a one dimentional array on the lowest level
     * @param {number[]} array - The array to fill
     * @param {TensorFillType} fillType - The Type of the values to fill
     * @returns the filled array
     */
    private static fillArray(
        array: number[],
        fillType: TensorFillType
    ): number[] {
        switch (fillType) {
            case TensorFillType.Zeros:
                return array.fill(0);
            case TensorFillType.Ones:
                return array.fill(1);
            case TensorFillType.Random:
                for (let i = 0; i < array.length; i++) {
                    const rand: number = Math.random();
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
        for (let i = 0; i < indices.length; i++) {
            result = result[indices[i]];
        }
        return result;
    }

    /**
     * Set the value at a certain index
     * @param {number[]} indices - The indices of the position
     * @param {number | any} value - The new value of the index
     */
    public set(indices: number[], value: number): void;
    public set(indices: number[], value: any) {
        this.validate(indices);
        if (
            !(indices.length === this.dim.length) &&
            !Tensor.isSameDimension(this.get(...indices), value)
        ) {
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
                `Tensor has the dimension of ${this.dim.length} but ${indices.length} arguments where provided`
            );
        }
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
        let dim = [];
        let currentArray: any = array;
        do {
            dim.push(array.length);
            currentArray = array[0];
        } while (!isNaN(currentArray[0]));
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
