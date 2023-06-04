import Copiable from './Copiable';
import Comparable from './Comparable';

/**
 * Represent a 2d Vector
 * @param {number} x The x value
 * @param {number} y The y value
 * @implements Copiable
 * @implements Comparable
 * @category Utils
 */
class Vec2 implements Copiable<Vec2>, Comparable<Vec2> {
    private _x: number;
    private _y: number;

    constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    /**
     * Get the x value
     * @type {number}
     */
    public get x(): number {
        return this._x;
    }

    /**
     * Get the y value
     * @type {number}
     */
    public get y(): number {
        return this._y;
    }

    /**
     * add The coordinate of the param vector to the coordinates of this vector
     * @param {Vec2} addVector - The add vector.
     * @returns {void}
     */
    public add(addVector: Vec2): void {
        this._x += addVector.x;
        this._y += addVector.y;
    }

    /**
     * Create a copy of this vector
     * @returns {Vec2} A copy of this vector
     */
    public copy(): Vec2 {
        return new Vec2(this._x, this._y);
    }

    /**
     * Check if the param vector is equal to this vector
     * @param {Vec2} other - The other vector to compare
     * @returns {boolean} True if the compared vectors are equal.
     */
    public isEqual(other: Vec2): boolean {
        return this._x === other._x && this._y === other._y;
    }
}

export default Vec2;
