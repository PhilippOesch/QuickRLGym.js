import seedrandom from "seedrandom";
import Action from "../enums/Action";
import GameState from "../interfaces/GameState";
import GameStateManager from "./GameStateManager";
import Utils from "../Utils";
import Customer from "./Customer";
import Player from "./Player";
import Vec2 from "./Vec2";

export default class TaxiGame {
    private player: Player;
    private customer: Customer;
    private gameStateManager: GameStateManager;
    private rng: seedrandom.PRNG;

    constructor(randomSeed?: number) {
        if (randomSeed) {
            this.rng = seedrandom(randomSeed.toString());
        } else {
            this.rng = seedrandom();
        }
    }

    public initGame(): void {
        const playerPos: Vec2 = Utils.getRandomPosition(this.rng);
        this.player = new Player(this, playerPos, Action.Down);

        const customerInfo: number[] = Utils.resetCustomer(this.rng, playerPos);
        this.customer = new Customer(customerInfo[0], customerInfo[1]);
    }

    public get getCustomer(): Customer {
        return this.customer;
    }

    public get getGameStateManager(): GameStateManager {
        return this.gameStateManager;
    }

    public get getPlayer(): Player {
        return this.player;
    }

    public get getRng(): seedrandom.PRNG {
        return this.rng;
    }

    public get getGameState(): GameState {
        return {
            playerPos: this.getPlayer.getPosition,
            customerPos: this.getCustomer.getPosition,
            isCustomerPickedUp: this.getPlayer.getCustomerPickedUp,
            iterations: this.gameStateManager.getIterations,
            points: this.gameStateManager.getPoints,
            isTerminal: this.getGameStateManager.getIsTerminal,
        };
    }
}
