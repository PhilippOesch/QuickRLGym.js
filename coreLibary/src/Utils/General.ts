import seedrandom from 'seedrandom';

export function shuffleArray(array: any[], rng?: seedrandom.PRNG): any[] {
    let shufflecopy = [...array];

    let internalRng = undefined;
    if (rng != undefined) {
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
