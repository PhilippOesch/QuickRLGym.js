import seedrandom from 'seedrandom';
import Globals from './Globals';
import Vec2 from './Vec2';
import GameState from './GameState';

module TaxiUtils {
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
}

export default TaxiUtils;
