export default class Vec2 {
    private x: number;
    private y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    get getX(): number {
        return this.x;
    }

    get getY(): number {
        return this.y;
    }

    add(addVector: Vec2): void {
        this.x += addVector.getX;
        this.y += addVector.getY;
    }

    copy(): Vec2 {
        return new Vec2(this.x, this.y);
    }

    isEqual(other: Vec2): boolean {
        return this.x == other.x && this.y == other.y;
    }
}
