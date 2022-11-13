module Utils {
    export function argMax(array: number[]): number {
        let maxIdx: number = 0;
        let max: number = array[0];
        for (let i = 0; i < array.length; i++) {
            if (array[i] > max) {
                max = array[i];
                maxIdx = i;
            }
        }
        return maxIdx;
    }
}

export default Utils;
