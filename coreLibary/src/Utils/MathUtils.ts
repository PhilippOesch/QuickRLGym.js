import seedrandom from 'seedrandom';

module MathUtils {
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

    export function shuffleArray(array: any[]): any[] {
        let shufflecopy = [...array];

        for (let i = shufflecopy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shufflecopy[i], shufflecopy[j]] = [shufflecopy[j], shufflecopy[i]];
        }

        return shufflecopy;
    }

    export function sampleN(
        array: any[],
        n: number,
        rng?: seedrandom.PRNG
    ): any[] {
        let randomGen: any;
        if (rng) {
            randomGen = rng;
        } else {
            randomGen = Math.random;
        }

        n = n == null ? 1 : n;
        const length: number = array == null ? 0 : array.length;
        if (!length || n < 1) {
            return [];
        }
        n = n > length ? length : n;

        let index: number = -1;
        const lastIndex: number = length - 1;
        const result: any[] = [...array];
        while (++index < n) {
            const rand: number =
                index + Math.floor(randomGen() * (lastIndex - index + 1));
            const value: number = result[rand];
            result[rand] = result[index];
            result[index] = value;
        }
        return result.slice(0, n);
    }
}

export default MathUtils;
