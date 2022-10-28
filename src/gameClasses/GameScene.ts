import 'phaser'
import CarMoveState from '../enums/CarMoveState';
import GameMap from './GameMap';
import Player from './Player';

export default class GameScene extends Phaser.Scene {
    private gameMap: GameMap;
    private player: Player;

    constructor ()
    {
        super('demo');
        this.gameMap = new GameMap(this);
        this.player = new Player(this, {x:1,y:2}, CarMoveState.Down);
    }

    preload(): void {
        this.gameMap.preload();
        this.player.preload();
    }

    create(): void {
        this.gameMap.create();
        this.player.create();
    }
}