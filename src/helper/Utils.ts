import seedrandom from "seedrandom";
import Globals from "../Globals";
import Vec2 from "../game/Vec2";
import GameState from "../game/GameState";

module Utils {
    export function adjustedToAbsPos(relPosition: Vec2): Vec2 {
        const x: number =
            (Globals.tileWidth * 1.5 +
                Globals.tileWidth * 2 * relPosition.getX) *
            Globals.scale;
        const y: number =
            (Globals.tileHeight * 1.5 + Globals.tileHeight * relPosition.getY) *
            Globals.scale;
        return new Vec2(x, y);
    }

    export function checkIfPositionIsDestination(position: Vec2): boolean {
        for (const destination of Globals.destinations) {
            if (destination.isEqual(position)) {
                return true;
            }
        }

        return false;
    }

    export function resetCustomer(
        rng: seedrandom.PRNG,
        playerPos: Vec2
    ): number[] {
        let spawnIdx: number = Math.floor(rng() * Globals.destinations.length);
        while (Globals.destinations[spawnIdx].isEqual(playerPos)) {
            spawnIdx = Math.floor(rng() * Globals.destinations.length);
        }
        let destIdx: number = Math.floor(rng() * Globals.destinations.length);
        while (
            Globals.destinations[spawnIdx].isEqual(
                Globals.destinations[destIdx]
            )
        ) {
            destIdx = Math.floor(rng() * Globals.destinations.length);
        }

        return [spawnIdx, destIdx];
    }

    export function getRandomPosition(rng: seedrandom.PRNG): Vec2 {
        const x: number = Math.floor(rng() * Globals.relWidth);
        const y: number = Math.floor(rng() * Globals.relHeigth);

        return new Vec2(x, y);
    }

    export function logGameState(gameState: GameState): void {
        console.info({
            gameState,
        });
    }

    export function genMulitiDArray(dims: number[]): Array<object> {
        const copyDims: number[] = [...dims];
        const array: Array<object> = new Array(dims[0]);
        copyDims.shift();
        genRecursiveSubArrays(copyDims, array);
        return array;
    }

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

    function genRecursiveSubArrays(dims: number[], array: object[]) {
        if (dims.length > 1) {
            const nextDim: number[] = [...dims];
            nextDim.shift();
            for (let i = 0; i < dims[0]; i++) {
                const pushArray: object[] = new Array(dims[1]);
                array[i] = pushArray;
                genRecursiveSubArrays(nextDim, pushArray);
            }
        }
        if (dims.length == 1) {
            for (let i = 0; i < dims[0]; i++) {
                array[i] = new Array<number>(dims[0]).fill(0);
            }
        }
    }
}

export default Utils;
