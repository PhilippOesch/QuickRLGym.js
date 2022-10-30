import 'phaser'
import CarMoveState from '../enums/CarMoveState';
import GameState from '../interfaces/GameState';
import GameMap from './GameMap';
import Player from './Player';

export default class GameScene extends Phaser.Scene {
    private gameMap: GameMap;
    private player: Player;
    private gameState: GameState;

    constructor ()
    {
        super('demo');
        this.gameMap = new GameMap(this);
        this.gameState= new GameState();
        this.player = new Player(this, {x:1,y:2}, CarMoveState.Down);
    }

    public get getGameMap(): GameMap{
        return this.gameMap;
    }

    public get getGameState(): GameState{
        return this.gameState;
    }

    public preload(): void {
        this.gameMap.preload();
        this.player.preload();
    }

    public create(): void {
        this.gameMap.create();
        this.player.create();
    }
}