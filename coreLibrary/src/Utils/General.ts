import seedrandom from 'seedrandom';

/**
 * static class for general utility
 * @module Utils/Generals
 * @category Utils
 */

/**
 * Shuffle the array
 * @param {any[]} array the array to shuffle
 * @param {seedrandom.PRNG} rng the random number generator
 * @returns {any[]} the shuffled array
 */
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

/**
 * samples n values from the provided array
 * @param {any[]} array the array to sample from
 * @param {number} n the number of values to sample
 * @param {seedrandom.PRNG} rng the random number generator
 * @returns the samples
 */
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

/**
 * linearly decay the epsilon value
 * @param {number} stepCount the current step
 * @param {number} decaySteps number of total decay steps
 * @param {number} epsilonStart epsilon start value
 * @param {number} epsilonEnd epsilon end value
 * @returns {number} the epsilon value and the new step count
 */
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
