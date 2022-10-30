import Globals from "../Globals";
import GameObject from "../interfaces/GameObject";
import GameScene from "./GameScene";

export default class GameMap extends GameObject {
    private layer: Phaser.Tilemaps.TilemapLayer;

    private static tileMap: number[][] = [
        [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
        [5, 1, 0, 0, 5, 0, 0, 0, 0, 2, 5],
        [5, 0, 0, 0, 5, 0, 0, 0, 0, 0, 5],
        [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
        [5, 0, 5, 0, 0, 0, 5, 0, 0, 0, 5],
        [5, 4, 5, 0, 0, 0, 5, 3, 0, 0, 5],
        [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    ];

    constructor(scene: GameScene) {
        super(scene);
    }

    public get getLayer(): Phaser.Tilemaps.TilemapLayer {
        return this.layer;
    }

    public preload(): void {
        this.scene.load.image("tiles", "assets/tilemap.png");
    }

    public create(): void {
        const map = this.scene.make.tilemap({
            data: GameMap.tileMap,
            tileWidth: 16,
            tileHeight: 16,
        });
        const tiles = map.addTilesetImage("tiles");
        this.layer = map.createLayer(0, tiles, 0, 0);
        this.layer.setScale(Globals.scale, Globals.scale);
    }
}
