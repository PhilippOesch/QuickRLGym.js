import seedrandom from 'seedrandom';
import { TaxiGlobals } from './index';
import Vec2 from '../../Utils/Vec2';
import TaxiGameState from './GameState';

export function adjustedToAbsPos(relPosition: Vec2): Vec2 {
    const x: number =
        (TaxiGlobals.tileWidth * 1.5 +
            TaxiGlobals.tileWidth * 2 * relPosition.getX) *
        TaxiGlobals.scale;
    const y: number =
        (TaxiGlobals.tileHeight * 1.5 +
            TaxiGlobals.tileHeight * relPosition.getY) *
        TaxiGlobals.scale;
    return new Vec2(x, y);
}

export function checkIfPositionIsDestination(position: Vec2): boolean {
    for (const destination of TaxiGlobals.destinations) {
        if (destination.isEqual(position)) {
            return true;
        }
    }

    return false;
}

export function resetCustomer(rng: seedrandom.PRNG, playerPos: Vec2): number[] {
    let spawnIdx: number = Math.floor(rng() * TaxiGlobals.destinations.length);
    while (TaxiGlobals.destinations[spawnIdx].isEqual(playerPos)) {
        spawnIdx = Math.floor(rng() * TaxiGlobals.destinations.length);
    }
    let destIdx: number = Math.floor(rng() * TaxiGlobals.destinations.length);
    while (
        TaxiGlobals.destinations[spawnIdx].isEqual(
            TaxiGlobals.destinations[destIdx]
        )
    ) {
        destIdx = Math.floor(rng() * TaxiGlobals.destinations.length);
    }

    return [spawnIdx, destIdx];
}

export function getRandomPosition(rng: seedrandom.PRNG): Vec2 {
    const x: number = Math.floor(rng() * TaxiGlobals.relWidth);
    const y: number = Math.floor(rng() * TaxiGlobals.relHeigth);

    return new Vec2(x, y);
}

export function logGameState(gameState: TaxiGameState): void {
    console.info({
        gameState,
    });
}
