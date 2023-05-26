/**
 * Represent a 2d Vector
 * @param {number} x The x value
 * @param {number} y The y value
 * @category Utils
 */
class Vec2 {
    private x: number;
    private y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    /**
     * Get the x value
     * @type {number}
     */
    public get getX(): number {
        return this.x;
    }

    /**
     * Get the y value
     * @type {number}
     */
    public get getY(): number {
        return this.y;
    }

    /**
     * add The coordinate of the param vector to the coordinates of this vector
     * @param {Vec2} addVector - The add vector.
     * @returns {void}
     */
    public add(addVector: Vec2): void {
        this.x += addVector.getX;
        this.y += addVector.getY;
    }

    /**
     * Create a copy of this vector
     * @returns {Vec2} A copy of this vector
     */
    public copy(): Vec2 {
        return new Vec2(this.x, this.y);
    }

    /**
     * Check if the param vector is equal to this vector
     * @param {Vec2} other - The other vector to compare
     * @returns {boolean} True if the compared vectors are equal.
     */
    public isEqual(other: Vec2): boolean {
        return this.x === other.x && this.y === other.y;
    }
}

export default Vec2;
