import seedrandom from 'seedrandom';

export function shuffleArray(array: any[], rng?: seedrandom.PRNG): any[] {
    let shufflecopy = [...array];

    let internalRng = undefined;
    if (rng !== undefined) {
        internalRng = rng;
    } else {
        internalRng = Math.random;
    }

    for (let i = shufflecopy.length - 1; i > 0; i--) {
        const j = Math.floor(internalRng() * (i + 1));
        [shufflecopy[i], shufflecopy[j]] = [shufflecopy[j], shufflecopy[i]];
    }

    return shufflecopy;
}

export function sampleN(array: any[], n: number, rng?: seedrandom.PRNG): any[] {
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

export function linearDecayEpsilon(
    stepCount: number,
    decaySteps: number,
    epsilonStart: number,
    epsilonEnd: number
): { epsilon: number; stepCount: number } {
    if (stepCount < decaySteps) {
        const epsilon =
            epsilonStart -
            ((epsilonStart - epsilonEnd) / decaySteps) * (stepCount + 1);
        return { epsilon: epsilon, stepCount: stepCount + 1 };
    } else {
        return { epsilon: epsilonEnd, stepCount: stepCount + 1 };
    }
}

export function numberArrayEquals(array1: number[], array2: number[]): boolean {
    if (
        (array1 === undefined && array2 !== undefined) ||
        (array1 !== undefined && array2 === undefined)
    ) {
        return false;
    }

    if (array1.length !== array2.length) {
        return false;
    }

    for (let i = 0; i < array1.length; i++) {
        if (array1[i] !== array2[i]) {
            return false;
        }
    }

    return true;
}
