import TaxiAction from './Action';
import TaxiGameState from './GameState';
import TaxiUtils from './TaxiUtils';
import TaxiCustomer from './Customer';
import TaxiPlayer from './Player';
import Vec2 from '../../Utils/Vec2';
import TaxiGlobals from './Globals';
import StepResult from '../../RLInterface/StepResult';
import seedrandom from 'seedrandom';

/**
 * The Taxi Game class
 * @property {Map<string, Action>} actionMapping - Static mapping of certain strings to actions.
 * @property {Player} player - The player object.
 * @property {Customer} customer - The customer object.
 */
export default class TaxiGame {
    public static readonly actionMapping: Map<string, TaxiAction> = new Map([
        ['Up', TaxiAction.Up],
        ['Down', TaxiAction.Down],
        ['Left', TaxiAction.Left],
        ['Right', TaxiAction.Right],
        ['PickUp', TaxiAction.PickUp],
        ['DropOff', TaxiAction.DropOff],
    ]);

    private player: TaxiPlayer;
    private customer: TaxiCustomer;

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

    public get getCustomer(): TaxiCustomer {
        return this.customer;
    }

    public get getPlayer(): TaxiPlayer {
        return this.player;
    }

    public get getGameState(): TaxiGameState {
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
        this.player = new TaxiPlayer(playerPos, TaxiAction.Down);

        const customerInfo: number[] = TaxiUtils.resetCustomer(
            this.rng,
            playerPos
        );
        this.customer = new TaxiCustomer(customerInfo[0], customerInfo[1]);
    }

    public reset(
        resetGameState: boolean = true,
        initialGameState?: TaxiGameState
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
        const action: TaxiAction = TaxiGame.actionMapping.get(actionString)!;
        this.incrementIterations();
        let stepResult: StepResult;
        if (action == TaxiAction.DropOff) {
            stepResult = this.dropOffCustomer();
        } else if (action == TaxiAction.PickUp) {
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
                TaxiGlobals.destinations[this.getCustomer.getDestIdx]
            ) &&
            this.customer.isCustomerPickedUp
        ) {
            this.updatePoints(TaxiGlobals.dropOffPassangerPoints);
            this.customer.dropOffCustomer();
            this.terminateGame();
            reward = TaxiGlobals.dropOffPassangerPoints;
        } else {
            this.updatePoints(TaxiGlobals.illegalMovePoints);
            reward = TaxiGlobals.illegalMovePoints;
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
            this.updatePoints(TaxiGlobals.stepPenaltyPoints);
            reward = TaxiGlobals.stepPenaltyPoints;
        } else {
            this.updatePoints(TaxiGlobals.illegalMovePoints);
            reward = TaxiGlobals.illegalMovePoints;
        }
        return { newState: this.getGameState, reward: reward };
    }

    public encodeStateToIndices(state: object): number[] {
        const gameState = state as TaxiGameState;
        return [
            gameState.playerPos.getX,
            gameState.playerPos.getY,
            gameState.destinationIdx,
            gameState.customerPosIdx,
        ];
    }

    public updatePlayerPosition(action: TaxiAction): StepResult {
        this.updatePoints(TaxiGlobals.stepPenaltyPoints);
        this.player.updatePosition(action);
        return {
            newState: this.getGameState,
            reward: TaxiGlobals.stepPenaltyPoints,
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
