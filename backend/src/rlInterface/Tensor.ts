import { isNumberObject } from "util/types";

export default class Tensor {
    private dim: number[];
    private array: Array<any>;

    constructor(dim: number[], array?: Array<any>) {
        this.dim = dim;
        if (array) {
            this.array = array;
        } else {
            this.array = this.init(dim);
        }
    }

    private init(dims: number[]): Array<any> {
        if (dims.length == 1) {
            return new Array<number>(dims[0]).fill(0);
        }
        let array = new Array(dims[0]);
        const copyDims: number[] = [...dims];
        copyDims.shift();
        for (let i = 0; i < dims[0]; i++) {
            array[i] = this.init(copyDims);
        }
        return array;
    }

    public get(...indices: number[]): Array<any> | number {
        this.validate(indices);

        let result = this.array;
        for (let i = 0; i < indices.length; i++) {
            result = result[indices[i]];
        }
        return result;
    }

    public set(indices: number[], value: number): void;
    public set(indices: number[], value: any) {
        this.validate(indices);
        if (
            !(indices.length == this.dim.length) &&
            !this.areDimsTheSame(this.get(...indices), value)
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

    private validate(indices: number[]): void {
        if (indices.length > this.dim.length) {
            throw new Error(
                `Tensor has the dimension of ${this.dim.length} but ${indices.length} arguments where provided`
            );
        }
    }

    private areDimsTheSame(comp1: any, comp2: any) {
        if (!isNaN(comp1) && !isNaN(comp2)) {
            return true;
        }
        const dimComp1 = this.getArrayDim(comp1);
        const dimComp2 = this.getArrayDim(comp2);
        if (dimComp1.length != dimComp2.length) {
            return false;
        }
        for (let i = 0; i < dimComp1.length; i++) {
            if (dimComp1[i] !== dimComp2[i]) {
                return false;
            }
        }
        return true;
    }

    private getArrayDim(array: Array<any>): number[] {
        let dim = [];
        let currentArray = array;
        do {
            dim.push(array.length);
            currentArray = array[0];
        } while (!isNaN(array[0]));
        return dim;
    }

    public copy(): Tensor {
        const copy = this.recCopy(this.array);
        return new Tensor([...this.dim], copy);
    }

    public get length(): number {
        let length = 1;
        for (const len of this.dim) {
            length *= len;
        }
        return length;
    }

    public get sum(): number {
        return this.recSum(this.array);
    }

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

    private recSum(array: Array<any>) {
        let sum = 0;
        for (let i = 0; i < array.length; i++) {
            if (!isNaN(array[i])) {
                sum += array[i];
            } else {
                sum += this.recSum(array[i]);
            }
        }
        return sum;
    }

    public toString(): string {
        return `Tensor(${this.array.toString()})`;
    }

    public get mean(): number {
        return this.sum / this.length;
    }

    public get getDim(): number[] {
        return this.dim;
    }
}
