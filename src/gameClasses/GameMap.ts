import 'phaser'
import GameObject from '../interfaces/GameObject';

export default class GameMap implements GameObject{
    private scene: Phaser.Scene

    static tileMap: number [][] = [
        [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
        [5, 1, 0, 0, 5, 0, 0, 0, 0, 2, 5],
        [5, 0, 0, 0, 5, 0, 0, 0, 0, 0, 5],
        [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
        [5, 0, 5, 0, 0, 0, 5, 0, 0, 0, 5],
        [5, 4, 5, 0, 0, 0, 5, 3, 0, 0, 5],
        [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    ]

    constructor(scene: Phaser.Scene){
        this.scene= scene;
    }

    preload(): void {
        this.scene.load.image('tiles', 'assets/tilemap.png');
    }

    create(): void {
        const map= this.scene.make.tilemap({
            data: GameMap.tileMap, tileWidth: 16, tileHeight: 16
        })
        const tiles = map.addTilesetImage('tiles');
        map.createLayer(0, tiles, 0, 0);
    }
}