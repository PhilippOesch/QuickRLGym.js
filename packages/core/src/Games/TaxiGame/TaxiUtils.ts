import seedrandom from 'seedrandom';
import { TaxiGlobals } from './index';
import Vec2 from '../../Utils/Vec2';
import TaxiGameState from './GameState';

/**
 * The Taxi Game Map
 * @module TaxiUtils
 * @category Games
 * @subcategory Taxi
 */

/**
 * Adjust the relative position to the absolute position
 * @param {Vec2} relPosition The relative position
 * @returns {Vec2}
 */
export function adjustedToAbsPos(relPosition: Vec2): Vec2 {
    const x: number =
        (TaxiGlobals.tileWidth * 1.5 +
            TaxiGlobals.tileWidth * 2 * relPosition.x) *
        TaxiGlobals.scale;
    const y: number =
        (TaxiGlobals.tileHeight * 1.5 +
            TaxiGlobals.tileHeight * relPosition.y) *
        TaxiGlobals.scale;
    return new Vec2(x, y);
}

/**
 * Check if the provided position is a destination
 * @param {Vec2} position the position
 * @returns {boolean} Whether it is a destination
 */
export function checkIfPositionIsDestination(position: Vec2): boolean {
    for (const destination of TaxiGlobals.destinations) {
        if (destination.isEqual(position)) {
            return true;
        }
    }

    return false;
}

/**
 * The Customer Starting State
 * @category Games
 * @subcategory Taxi
 * @property {number} spawnIdx The spawn destination index
 * @property {number} destIdx The destination index
 */
export interface CustomerStartState {
    spawnIdx: number;
    destIdx: number;
}

/**
 * Reset the customer position
 * @param {seedrandom.PRNG} rng the random number generator
 * @param {Vec2} playerPos The player position
 * @returns {CustomerStartState} The customers starting state
 */
export function resetCustomer(
    rng: seedrandom.PRNG,
    playerPos: Vec2
): CustomerStartState {
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

    return {
        spawnIdx: spawnIdx,
        destIdx: destIdx,
    };
}

/**
 * Get a random game position
 * @param {seedrandom.PRNG} rng The random number generator
 * @returns {Vec2} the position
 */
export function getRandomPosition(rng: seedrandom.PRNG): Vec2 {
    const x: number = Math.floor(rng() * TaxiGlobals.relWidth);
    const y: number = Math.floor(rng() * TaxiGlobals.relHeigth);

    return new Vec2(x, y);
}

/**
 * log the game state
 * @param {TaxiGameState} gameState the game state
 * @returns {void}
 */
export function logGameState(gameState: TaxiGameState): void {
    console.info({
        gameState,
    });
}
