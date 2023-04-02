import TaxiAction from './Action';
import TaxiGameState from './GameState';
import { TaxiUtils } from '.';
import TaxiCustomer from './Customer';
import TaxiPlayer from './Player';
import Vec2 from '../../Utils/Vec2';
import { TaxiGlobals } from './index';
import StepResult from '../../RLInterface/StepResult';
import seedrandom from 'seedrandom';

/**
 * The Taxi Game class
 * @property {Map<string, TaxiAction>} actionMapping - Static mapping of certain strings to actions.
 * @property {TaxiPlayer} player - The player object.
 * @property {TaxiCustomer} customer - The customer object.
 */
export default class TaxiGame {
    private static readonly _gameStateDim: number[] = [5, 5, 4, 5];

    public static readonly actionMapping: Map<string, TaxiAction> = new Map([
        ['Up', TaxiAction.Up],
        ['Down', TaxiAction.Down],
        ['Left', TaxiAction.Left],
        ['Right', TaxiAction.Right],
        ['PickUp', TaxiAction.PickUp],
        ['DropOff', TaxiAction.DropOff],
    ]);

    private _player: TaxiPlayer;
    private _customer: TaxiCustomer;
    private _rng: seedrandom.PRNG;
    private _isTerminal: boolean = false;
    private _points: number = 0;
    private _iteration: number = 0;

    public static get getActionSpace(): string[] {
        return Array.from(TaxiGame.actionMapping.keys());
    }

    /**
     * @param {number} randomSeed - Set a random seed for the game for reproducability.
     */
    constructor(randomSeed?: number) {
        if (randomSeed) {
            this._rng = seedrandom(randomSeed.toString());
        } else {
            this._rng = seedrandom();
        }
    }

    public set setRng(randomSeed: number) {
        this._rng = seedrandom(randomSeed.toString());
        this.reset();
    }

    public static get gameStateDim(): number[] {
        return TaxiGame._gameStateDim;
    }

    public get customer(): TaxiCustomer {
        return this._customer;
    }

    public get player(): TaxiPlayer {
        return this._player;
    }

    public get gameState(): TaxiGameState {
        return {
            playerPos: this._player.position.copy(),
            destinationIdx: this._customer.destIdx,
            customerPosIdx: this.getEncodedCustomerPos(),
        };
    }

    public get return(): number {
        return Number(this._points);
    }

    public get isTerminal(): boolean {
        return this._isTerminal;
    }

    public continue(): void {
        this._isTerminal = false;
    }

    /**
     * Initialize the game objects
     */
    public initGame(): void {
        this.spawnGameElements();
    }

    public updatePoints(points: number): void {
        this._points += points;
    }

    public terminateGame(): void {
        this._isTerminal = true;
    }

    /**
     * Spawn the player and customer object
     */
    public spawnGameElements(): void {
        const playerPos: Vec2 = TaxiUtils.getRandomPosition(this._rng);
        this._player = new TaxiPlayer(playerPos, TaxiAction.Down);

        const customerInfo: number[] = TaxiUtils.resetCustomer(
            this._rng,
            playerPos
        );
        this._customer = new TaxiCustomer(customerInfo[0], customerInfo[1]);
    }

    public reset(
        resetGameState: boolean = true,
        initialGameState?: TaxiGameState
    ): boolean {
        this.spawnGameElements();
        if (initialGameState) {
            this._player.position = initialGameState.playerPos.copy();
            this._customer.setNewPosition(
                initialGameState.customerPosIdx,
                initialGameState.destinationIdx
            );
        }
        if (resetGameState) {
            this._points = 0;
            this._isTerminal = false;
            this._iteration = 0;
        } else {
            this._isTerminal = false;
        }
        return true;
    }

    /**
     * Perform a single game step
     * @param {string} actionString - The action to perform.
     */
    public step(actionString: string): StepResult {
        const action: TaxiAction | undefined =
            TaxiGame.actionMapping.get(actionString);
        if (action === undefined) {
            throw Error('Illegal Action');
        }
        this.incrementIterations();
        let stepResult: StepResult;
        if (action === TaxiAction.DropOff) {
            stepResult = this.dropOffCustomer();
        } else if (action === TaxiAction.PickUp) {
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
        if (this.customer.isCustomerPickedUp) {
            return 4;
        }
        return this.customer.spawnDestIdx;
    }

    private dropOffCustomer(): StepResult {
        let reward: number;
        if (
            this._player.position.isEqual(
                TaxiGlobals.destinations[this.customer.destIdx]
            ) &&
            this._customer.isCustomerPickedUp
        ) {
            this.updatePoints(TaxiGlobals.dropOffPassangerPoints);
            this._customer.dropOffCustomer();
            this.terminateGame();
            reward = TaxiGlobals.dropOffPassangerPoints;
        } else {
            this.updatePoints(TaxiGlobals.illegalMovePoints);
            reward = TaxiGlobals.illegalMovePoints;
        }
        return {
            newState: this.gameState,
            reward: reward,
        };
    }

    private pickUpCustomer(): StepResult {
        let reward: number;
        if (
            !this._customer.isCustomerPickedUp &&
            this._player.position.isEqual(this.customer.position)
        ) {
            this._customer.pickUpCustomer();
            this.updatePoints(TaxiGlobals.stepPenaltyPoints);
            reward = TaxiGlobals.stepPenaltyPoints;
        } else {
            this.updatePoints(TaxiGlobals.illegalMovePoints);
            reward = TaxiGlobals.illegalMovePoints;
        }
        return {
            newState: this.gameState,
            reward: reward,
        };
    }

    public static encodeStateToIndices(state: TaxiGameState): number[] {
        return [
            state.playerPos.getX,
            state.playerPos.getY,
            state.destinationIdx,
            state.customerPosIdx,
        ];
    }

    public updatePlayerPosition(action: TaxiAction): StepResult {
        this.updatePoints(TaxiGlobals.stepPenaltyPoints);
        this._player.updatePosition(action);
        return {
            newState: this.gameState,
            reward: TaxiGlobals.stepPenaltyPoints,
        };
    }

    public incrementIterations(): void {
        this._iteration++;
    }

    public get iteration(): number {
        return this._iteration;
    }

    public get rng(): seedrandom.PRNG {
        return this._rng;
    }
}
