import Action from './Action';
import GameState from './GameState';
import TaxiUtils from './TaxiUtils';
import Customer from './Customer';
import Player from './Player';
import Vec2 from './Vec2';
import Globals from './Globals';
import StepResult from '../../RLInterface/StepResult';
import seedrandom from 'seedrandom';

/**
 * The Taxi Game class
 * @property {Map<string, Action>} actionMapping - Static mapping of certain strings to actions.
 * @property {Player} player - The player object.
 * @property {Customer} customer - The customer object.
 */
export default class TaxiGame {
    public static readonly actionMapping: Map<string, Action> = new Map([
        ['Up', Action.Up],
        ['Down', Action.Down],
        ['Left', Action.Left],
        ['Right', Action.Right],
        ['PickUp', Action.PickUp],
        ['DropOff', Action.DropOff],
    ]);

    private player: Player;
    private customer: Customer;

    protected rng: seedrandom.PRNG;
    protected isTerminal: boolean = false;
    protected points: number = 0;
    protected iteration: number = 0;

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

    public continue(): void {
        this.isTerminal = false;
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
        const playerPos: Vec2 = TaxiUtils.getRandomPosition(this.rng);
        this.player = new Player(playerPos, Action.Down);

        const customerInfo: number[] = TaxiUtils.resetCustomer(
            this.rng,
            playerPos
        );
        this.customer = new Customer(customerInfo[0], customerInfo[1]);
    }

    public reset(
        resetGameState: boolean = true,
        initialGameState?: GameState
    ): boolean {
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
        } else {
            this.isTerminal = false;
        }
        return true;
    }

    /**
     * Perform a single game step
     * @param {string} actionString - The action to perform.
     */
    public step(actionString: string): StepResult {
        const action: Action = TaxiGame.actionMapping.get(actionString)!;
        this.incrementIterations();
        let stepResult: StepResult;
        if (action == Action.DropOff) {
            stepResult = this.dropOffCustomer();
        } else if (action == Action.PickUp) {
            stepResult = this.pickUpCustomer();
        } else {
            stepResult = this.updatePlayerPosition(action);
        }
        return stepResult;
    }

    /**
     * Encodes the customer Position for the GameState (see GameState-Interface)
     * @returns {number} - [0<=x<=3] if customer hasn't been picked up or 4 if the customer has been picked up.
     */
    private getEncodedCustomerPos(): number {
        if (this.getCustomer.isCustomerPickedUp) {
            return 4;
        }
        return this.getCustomer.getSpawnDestIdx;
    }

    private dropOffCustomer(): StepResult {
        let reward: number = 0;
        if (
            this.player.getPosition.isEqual(
                Globals.destinations[this.getCustomer.getDestIdx]
            ) &&
            this.customer.isCustomerPickedUp
        ) {
            this.updatePoints(Globals.dropOffPassangerPoints);
            this.customer.dropOffCustomer();
            this.terminateGame();
            reward = Globals.dropOffPassangerPoints;
        } else {
            this.updatePoints(Globals.illegalMovePoints);
            reward = Globals.illegalMovePoints;
        }
        return { newState: this.getGameState, reward: reward };
    }

    private pickUpCustomer(): StepResult {
        let reward: number = 0;
        if (
            !this.customer.isCustomerPickedUp &&
            this.player.getPosition.isEqual(this.getCustomer.getPosition)
        ) {
            this.customer.pickUpCustomer();
            this.updatePoints(Globals.stepPenaltyPoints);
            reward = Globals.stepPenaltyPoints;
        } else {
            this.updatePoints(Globals.illegalMovePoints);
            reward = Globals.illegalMovePoints;
        }
        return { newState: this.getGameState, reward: reward };
    }

    public encodeStateToIndices(state: object): number[] {
        const gameState = state as GameState;
        return [
            gameState.playerPos.getX,
            gameState.playerPos.getY,
            gameState.destinationIdx,
            gameState.customerPosIdx,
        ];
    }

    public updatePlayerPosition(action: Action): StepResult {
        this.updatePoints(Globals.stepPenaltyPoints);
        this.player.updatePosition(action);
        return {
            newState: this.getGameState,
            reward: Globals.stepPenaltyPoints,
        };
    }

    public incrementIterations(): void {
        this.iteration++;
    }

    public get getIteration(): number {
        return this.iteration;
    }

    public get getRng(): seedrandom.PRNG {
        return this.rng;
    }
}
