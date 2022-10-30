import "phaser";
import CarMoveState from "../enums/CarMoveState";
import Utils from "../Utils";
import Customer from "./Customer";
import GameMap from "./GameMap";
import GameScoreUI from "./GameScoreUI";
import Player from "./Player";
import Vec2 from "./Vec2";

export default class GameScene extends Phaser.Scene {
    private gameMap: GameMap;
    private player: Player;
    private customer: Customer;
    private gameScoreUI: GameScoreUI;

    constructor() {
        super("Taxi Game");
        this.initGame();
    }

    public get getGameMap(): GameMap {
        return this.gameMap;
    }

    public get getGameState(): GameScoreUI {
        return this.gameScoreUI;
    }

    public get getCustomer(): Customer {
        return this.customer;
    }

    public get getPlayer(): Player {
        return this.player;
    }

    public preload(): void {
        this.gameMap.preload();
        this.player.preload();
        this.customer.preload();
        this.gameScoreUI.preload();
    }

    public create(): void {
        this.gameMap.create();
        this.player.create();
        this.customer.create();
        this.gameScoreUI.create();
        this.gameScoreUI.setDestination(this.customer.getDestIdx);
    }

    public initGame(): void {
        this.gameMap = new GameMap(this);
        this.gameScoreUI = new GameScoreUI(this);

        const playerPos: Vec2 = Utils.getRandomPosition();
        this.player = new Player(this, playerPos, CarMoveState.Down);

        const customerInfo: number[] = Utils.resetCustomer(playerPos);
        this.customer = new Customer(this, customerInfo[0], customerInfo[1]);
    }

    public updatePoints(points: number): void {
        this.gameScoreUI.updatePoints(points);
    }

    public respawnCustomer(): void {
        const customerInfo: number[] = Utils.resetCustomer(
            this.getPlayer.getRelPosition
        );
        this.gameScoreUI.setDestination(customerInfo[1]);
        this.customer.setNewPosition(customerInfo[0], customerInfo[1]);
    }
}
