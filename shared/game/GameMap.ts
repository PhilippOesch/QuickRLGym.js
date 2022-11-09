export default class GameMap {
    /**
     * The map that defines the tile type for the rendering of the map.
     */
    public static readonly tileMap: number[][] = [
        [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
        [5, 1, 0, 0, 5, 0, 0, 0, 0, 2, 5],
        [5, 0, 0, 0, 5, 0, 0, 0, 0, 0, 5],
        [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
        [5, 0, 5, 0, 0, 0, 5, 0, 0, 0, 5],
        [5, 4, 5, 0, 0, 0, 5, 3, 0, 0, 5],
        [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    ];
}