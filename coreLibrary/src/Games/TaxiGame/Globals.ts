import Vec2 from '../../Utils/Vec2';

/**
 * The Taxi Game Map
 * @module TaxiGlobals
 * @category Games
 * @subcategory Taxi
 */

/**
 * The tile width
 * @type {number}
 */
export const tileWidth: number = 64;
/**
 * The tile width
 * @type {number}
 */
export const tileHeight: number = 64;
/**
 * The map width
 * @type {number}
 */
export const mapWidth: number = 11;
/**
 * The map height
 * @type {number}
 */
export const mapHeigth: number = 7;

/**
 * The relative map width
 * @type {number}
 */
export const relWidth: number = 5;

/**
 * The relative map height
 * @type {number}
 */
export const relHeigth: number = 5;

/**
 * The penalty when trying to perform an illegal move
 * @type {number}
 */
export const illegalMovePoints: number = -10;

/**
 * The amount of point received when successfully dropping of a passanger
 * @type {number}
 */
export const dropOffPassangerPoints: number = 20;

/**
 * The penalty points received each steps.
 * @type {number}
 */
export const stepPenaltyPoints: number = -1;

/**
 * The scale value for the visual enviroment
 * @type {number}
 */
export const scale: number = 1;

/**
 * The positions of the destinations
 * @type {Vec2[]}
 */
export const destinations: Vec2[] = [
    new Vec2(0, 0),
    new Vec2(0, 4),
    new Vec2(4, 0),
    new Vec2(3, 4),
];
