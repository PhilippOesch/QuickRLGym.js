export function argMax(array: number[]): number {
    if (!array || array.length < 1) {
        return -1;
    }

    let maxIdx: number = 0;
    let max: number = array[0];
    for (let i = 1; i < array.length; i++) {
        if (array[i] > max) {
            max = array[i];
            maxIdx = i;
        }
    }
    return maxIdx;
}

export function sum(array: number[]): number {
    if (array === undefined || array.length == 0) {
        return 0;
    }

    let sum = 0;
    for (let i = 0; i < array.length; i++) {
        sum += array[i];
    }

    return sum;
}
