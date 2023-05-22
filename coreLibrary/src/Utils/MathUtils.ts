/**
 * static class for general utility
 * @module Utils/MathUtils
 * @category Utils
 */

/**
 * Returns the index of the maximum Value
 * @param {number[]} array A numbers array
 * @returns {number} the index of the maximum value
 */
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

/**
 * Calculate the Sum of a numbers array
 * @param {number[]} array the numbers array
 * @returns {number} The sum
 */
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
