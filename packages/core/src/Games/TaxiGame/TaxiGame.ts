import TaxiAction, { TaxiActionKey } from "./Action";
import TaxiGameState from "./GameState";
import * as TaxiGlobals from "./Globals";
import * as TaxiUtils from "./TaxiUtils";
import TaxiCustomer from "./Customer";
import TaxiPlayer from "./Player";
import Vec2 from "../../Utils/Vec2";
import StepResult from "../../RLInterface/StepResult";
import seedrandom from "seedrandom";
import { CustomerStartState } from "./TaxiUtils";

/**
 * The Taxi Game class
 * @param {?number} randomSeed the random seed
 * @category Games
 * @subcategory Taxi
 */
class TaxiGame {
  private static readonly _gameStateDim: number[] = [5, 5, 4, 5];

  /**
   * Mapping of actions
   * @type {Map<TaxiActionKey, TaxiAction>}
   * @readonly
   */
  public static readonly actionMapping: Map<TaxiActionKey, TaxiAction> =
    new Map([
      ["Up", TaxiAction.Up],
      ["Down", TaxiAction.Down],
      ["Left", TaxiAction.Left],
      ["Right", TaxiAction.Right],
      ["PickUp", TaxiAction.PickUp],
      ["DropOff", TaxiAction.DropOff],
    ]);

  private _player: TaxiPlayer;
  private _customer: TaxiCustomer;
  private _rng: seedrandom.PRNG;
  private _isTerminal: boolean = false;
  private _points: number = 0;
  private _iteration: number = 0;

  /**
   * Get The action space
   * @type {string[]}
   */
  public static get getActionSpace(): string[] {
    return Array.from(TaxiGame.actionMapping.keys());
  }

  constructor(randomSeed?: number) {
    if (randomSeed) {
      this._rng = seedrandom(randomSeed.toString());
    } else {
      this._rng = seedrandom();
    }
  }

  /**
   * Set the games random seed
   * @type {number}
   */
  public set setRng(randomSeed: number) {
    this._rng = seedrandom(randomSeed.toString());
    this.reset();
  }

  /**
   * Set the games state dimension
   * @type {number[]}
   */
  public static get gameStateDim(): number[] {
    return TaxiGame._gameStateDim;
  }

  /**
   * Get the customer
   * @type {TaxiCustomer}
   */
  public get customer(): TaxiCustomer {
    return this._customer;
  }

  /**
   * get the player
   * @type {TaxiPlayer}
   */
  public get player(): TaxiPlayer {
    return this._player;
  }

  /**
   * Get the games current state
   * @type {TaxiGameState}
   */
  public get gameState(): TaxiGameState {
    return {
      playerPos: this._player.position.copy(),
      destinationIdx: this._customer.destIdx,
      customerPosIdx: this.getEncodedCustomerPos(),
    };
  }

  /**
   * Get the games current return
   * @type {number}
   */
  public get return(): number {
    return Number(this._points);
  }

  /**
   * Get whether the game has reached a terminal state
   * @type {boolean}
   */
  public get isTerminal(): boolean {
    return this._isTerminal;
  }

  /**
   * Continue the current game
   * @return {void}
   */
  public continue(): void {
    this._isTerminal = false;
  }

  /**
   * Initialize the game objects
   * @returns {void}
   */
  public initGame(): void {
    this.spawnGameElements();
  }

  /**
   * Update the number of points
   * @param {number} points The points to add / subtract
   * @returns {void}
   */
  public updatePoints(points: number): void {
    this._points += points;
  }

  /**
   * Terminate the game
   * @returns {void}
   */
  public terminateGame(): void {
    this._isTerminal = true;
  }

  /**
   * Spawn the player and customer object
   * @returns {void}
   */
  public spawnGameElements(): void {
    const playerPos: Vec2 = TaxiUtils.getRandomPosition(this._rng);
    this._player = new TaxiPlayer(playerPos, TaxiAction.Down);

    const customerInfo: CustomerStartState = TaxiUtils.resetCustomer(
      this._rng,
      playerPos
    );
    this._customer = new TaxiCustomer(
      customerInfo.spawnIdx,
      customerInfo.destIdx
    );
  }

  /**
   * Reset the game
   * @param {boolean} [resetGameState=true] Whether to reset the games state
   * @param {?TaxiGameState} initialGameState The initial game state
   * @returns {boolean} Whether the reset was successful
   */
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
   * @param {TaxiActionKey} actionString - The action to perform.
   * @returns {StepResult} The result of the step
   */
  public step(actionString: TaxiActionKey): StepResult<TaxiGameState> {
    const action: TaxiAction | undefined =
      TaxiGame.actionMapping.get(actionString);
    if (action === undefined) {
      throw Error("Illegal Action");
    }
    this.incrementIterations();
    let stepResult: StepResult<TaxiGameState>;
    if (action === TaxiAction.DropOff) {
      stepResult = this.dropOffCustomer();
    } else if (action === TaxiAction.PickUp) {
      stepResult = this.pickUpCustomer();
    } else {
      stepResult = this.updatePlayerPosition(action);
    }
    return stepResult;
  }

  private getEncodedCustomerPos(): number {
    if (this.customer.isCustomerPickedUp) {
      return 4;
    }
    return this.customer.spawnDestIdx;
  }

  private dropOffCustomer(): StepResult<TaxiGameState> {
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

  private pickUpCustomer(): StepResult<TaxiGameState> {
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

  /**
   * encode the game state to an encoded numbers array
   * @param {TaxiGameState} state the state to encode
   * @returns {number[]} The encoded array
   */
  public static encodeStateToIndices(state: TaxiGameState): number[] {
    return [
      state.playerPos.x,
      state.playerPos.y,
      state.destinationIdx,
      state.customerPosIdx,
    ];
  }

  /**
   * Update the player position with the taken action
   * @param {TaxiAction} action the taken action
   * @returns {StepResult} The result of the steps
   */
  public updatePlayerPosition(action: TaxiAction): StepResult<TaxiGameState> {
    this.updatePoints(TaxiGlobals.stepPenaltyPoints);
    this._player.updatePosition(action);
    return {
      newState: this.gameState,
      reward: TaxiGlobals.stepPenaltyPoints,
    };
  }

  /**
   * Increment the game iteration
   * @returns {void}
   */
  public incrementIterations(): void {
    this._iteration++;
  }

  /**
   * Get the iteration
   * @type {number}
   */
  public get iteration(): number {
    return this._iteration;
  }

  /**
   * Get the random number generator
   * @type {seedrandom.PRNG}
   */
  public get rng(): seedrandom.PRNG {
    return this._rng;
  }
}

export default TaxiGame;
