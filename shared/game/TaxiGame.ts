import seedrandom from "seedrandom";
import Action from "./Action";
import GameState from "./GameState";
import Utils from "../Utils";
import Customer from "./Customer";
import Player from "./Player";
import Vec2 from "./Vec2";
import fs from "fs";

/**
 * The Taxi Game class
 * @property {Map<string, Action>} actionMapping - Static mapping of certain strings to actions.
 * @property {Player} player - The player object.
 * @property {Customer} customer - The customer object.
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
    private rng: seedrandom.PRNG;
    private points: number = 0;
    private isTerminal: boolean = false;
    private iteration: number = 0;

    public static get getActionSpace(): string[] {
        return Array.from(TaxiGame.actionMapping.keys());
    }

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

    public get getPlayer(): Player {
        return this.player;
    }

    public get getRng(): seedrandom.PRNG {
        return this.rng;
    }

    public get getGameState(): GameState {
        return {
            playerPos: this.player.getPosition.copy(),
            destinationIdx: this.customer.getDestIdx,
            customerPosIdx: this.getEncodedCustomerPos(),
        };
    }

    public get getPayoff(): number {
        return Number(this.points);
    }

    public get getIsTerminal(): boolean {
        return this.isTerminal;
    }

    public get getIteration(): number {
        return this.iteration;
    }

    public continue(): void {
        this.isTerminal = false;
    }

    public incrementIterations(): void {
        this.iteration++;
    }

    /**
     * Initialize the game objects
     */
    public initGame(): void {
        this.spawnGameElements();
    }

    public updatePoints(points: number): void {
        this.points += points;
    }

    public terminateGame(): void {
        this.isTerminal = true;
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
    public async reset(
        resetGameState: boolean = true,
        initialGameState?: GameState
    ): Promise<boolean> {
        this.spawnGameElements();
        if (initialGameState) {
            this.player.setPosition = initialGameState.playerPos.copy();
            this.customer.setNewPosition(
                initialGameState.customerPosIdx,
                initialGameState.destinationIdx
            );
        }
        if (resetGameState) {
            this.points = 0;
            this.isTerminal = false;
            this.iteration = 0;
        }
        //console.log("reset");
        return true;
    }

    /**
     * Perform a single game step
     * @param {string} actionString - The action to perform.
     */
    public step(actionString: string): string {
        const action: Action = TaxiGame.actionMapping.get(actionString)!;
        this.incrementIterations();
        const takenAktion = this.player.playAction(action);
        return actionString;
    }

    /**
     * Encodes the customer Position for the GameState (see GameState-Interface)
     * @returns {number} - [0<=x<=3] if customer hasn't been picked up or 4 if the customer has been picked up.
     */
    private getEncodedCustomerPos(): number {
        if (this.getPlayer.getCustomerPickedUp) {
            return 4;
        }
        return this.getCustomer.getSpawnDestIdx;
    }
}
