import seedrandom from "seedrandom";
import Action from "../rlInterface/Action";
import GameState from "./GameState";
import GameStateManager from "./GameStateManager";
import Utils from "../helper/Utils";
import Customer from "./Customer";
import Player from "./Player";
import Vec2 from "./Vec2";

/**
 * The Taxi Game class
 * @property {Map<string, Action>} actionMapping - Static mapping of certain strings to actions.
 * @property {Player} player - The player object.
 * @property {Customer} customer - The customer object.
 * @property {GameStateManager} gameStateManager - The game state manager object.
 * @property {rng} rng - The random number generator.
 */
export default class TaxiGame {
    public static readonly actionMapping: Map<string, Action> = new Map([
        ["Up", Action.Up],
        ["Down", Action.Down],
        ["Left", Action.Left],
        ["Right", Action.Right],
        ["PickUp", Action.PickUp],
        ["DropOff", Action.DropOff],
    ]);

    private player: Player;
    private customer: Customer;
    private gameStateManager: GameStateManager;
    private rng: seedrandom.PRNG;

    /**
     * @param {number} randomSeed - Set a random seed for the game for reproducability.
     */
    constructor(randomSeed?: number) {
        if (randomSeed) {
            this.rng = seedrandom(randomSeed.toString());
        } else {
            this.rng = seedrandom();
        }
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

    /**
     * Initialize the game objects
     */
    public initGame(): void {
        this.spawnGameElements();
        this.gameStateManager = new GameStateManager();
    }

    /**
     * Spawn the player and customer object
     */
    public spawnGameElements(): void {
        const playerPos: Vec2 = Utils.getRandomPosition(this.rng);
        this.player = new Player(this, playerPos, Action.Down);

        const customerInfo: number[] = Utils.resetCustomer(this.rng, playerPos);
        this.customer = new Customer(customerInfo[0], customerInfo[1]);
    }

    /**
     * Reset the game
     * @param {boolean} resetGameState - Set to false if only the game objects should be respawn without reseting the point and iteration score.
     */
    public reset(resetGameState: boolean = true): void {
        this.spawnGameElements();
        if (resetGameState) {
            this.gameStateManager.resetGameState();
        }
    }

    /**
     * Perform a single game step
     * @param {string} actionString - The action to perform.
     */
    public step(actionString: string) {
        const action: Action = TaxiGame.actionMapping.get(actionString)!;
        this.player.playAction(action);
    }
}
