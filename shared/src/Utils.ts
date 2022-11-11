import seedrandom from "seedrandom";
import Globals from "./Globals";
import Vec2 from "./game/Vec2";
import GameState from "./game/GameState";

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

    export function genMultiDimArray(dims: number[]): Array<any> {
        if (dims.length == 1) {
            return new Array<number>(dims[0]).fill(0);
        }
        let array = new Array(dims[0]);
        const copyDims: number[] = [...dims];
        copyDims.shift();
        for (let i = 0; i < dims[0]; i++) {
            array[i] = genMultiDimArray(copyDims);
        }
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

    export function getMultiDimArrayLength(array: Array<any>): number {
        let size = 0;
        for (let i = 0; i < array.length; i++) {
            if (!isNaN(array[i])) {
                size += 1;
            } else {
                size += getMultiDimArrayLength(array[i]);
            }
        }
        return size;
    }

    export function getSumMultiDimArray(array: Array<any>): number {
        let sum = 0;
        for (let i = 0; i < array.length; i++) {
            if (!isNaN(array[i])) {
                sum += array[i];
            } else {
                sum += getSumMultiDimArray(array[i]);
            }
        }
        return sum;
    }

    export function getMeanMultiDimArray(array: Array<any>): number {
        let size = getMultiDimArrayLength(array);
        let sum = getSumMultiDimArray(array);
        return sum / size;
    }
}

export default Utils;
