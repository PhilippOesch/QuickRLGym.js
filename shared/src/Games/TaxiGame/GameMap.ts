export default class GameMap {
    /**
     * The map that defines the tile type for the rendering of the map.
     */
    public static readonly tileMap: number[][] = [
        [0, 12, 12, 12, 18, 12, 12, 12, 12, 12, 1],
        [8, 13, 19, 19, 6, 19, 19, 19, 19, 16, 9],
        [8, 19, 19, 19, 10, 19, 19, 19, 19, 19, 9],
        [8, 19, 19, 19, 19, 19, 19, 19, 19, 19, 9],
        [8, 19, 3, 19, 19, 19, 3, 19, 19, 19, 9],
        [8, 11, 6, 19, 19, 19, 6, 14, 19, 19, 9],
        [4, 2, 17, 2, 2, 2, 17, 2, 2, 2, 5],
    ];

    /**
     * Set of wall tiles
     */
    public static wallTiles: Set<number> = new Set([
        0, 1, 4, 5, 8, 12, 9, 2, 17, 6, 3, 18, 10,
    ]);
}
