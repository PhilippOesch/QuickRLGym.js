import Action from "../enums/Action";
import GameState from "../interfaces/GameState";
import Utils from "../Utils";
import Customer from "./Customer";
import GameMap from "./GameMap";
import Player from "./Player";
import Vec2 from "./Vec2";

export default class GameManager {
    private gameMap: GameMap;
    private player: Player;
    private customer: Customer;
    private gameState: GameState;

    constructor() {
        this.initGame();
    }

    public initGame(): void {
        this.gameMap = new GameMap();

        const playerPos: Vec2 = Utils.getRandomPosition();
        this.player = new Player(this, playerPos, Action.Down);

        const customerInfo: number[] = Utils.resetCustomer(playerPos);
        this.customer = new Customer(customerInfo[0], customerInfo[1]);
    }

    public get getGameMap(): GameMap {
        return this.gameMap;
    }

    public get getCustomer(): Customer {
        return this.customer;
    }

    public get getGameState(): GameState {
        return this.gameState;
    }

    public get getPlayer(): Player {
        return this.player;
    }
}
