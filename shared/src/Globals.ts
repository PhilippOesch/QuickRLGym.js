import Vec2 from "./game/Vec2";

module Globals {
    export const tileWidth: number = 16;
    export const tileHeight: number = 16;
    export const mapWidth: number = 11;
    export const mapHeigth: number = 7;

    export const relWidth: number = 5;
    export const relHeigth: number = 5;

    export const illegalMovePoints: number = -10;
    export const dropOffPassangerPoints: number = 20;
    export const stepPenaltyPoints: number = -1;

    export const scale: number = 4;

    export const destinations: Vec2[] = [
        new Vec2(0, 0),
        new Vec2(0, 4),
        new Vec2(4, 0),
        new Vec2(3, 4),
    ];
}

export default Globals;
