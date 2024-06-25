import StepResult from "../../RLInterface/StepResult";
import seedrandom from "seedrandom";
import BlackJackAction, { BlackJackActionKey } from "./Action";
import BlackJackPlayer from "./Player";
import BlackJackDealer from "./Dealer";
import BlackJackGameState from "./GameState";
import BlackJackCard from "./Card";

type;

/**
 * The Black Jack implementation is oriented on the logic described in Richard
 * S. Sutton and Andrew G. Barto 'Reinforcement Learning: An Introduction' Example 5.1..
 * @param {?number} randomSeed the random seed
 * @category Games
 * @subcategory BlackJack
 */
class BlackJackGame {
  /**
   * The action mapping
   * @static
   * @type {Map<BlackJackActionKey, BlackJackAction>}
   * @readonly
   */
  public static readonly actionMapping: Map<
    BlackJackActionKey,
    BlackJackAction
  > = new Map([
    ["Stick", BlackJackAction.Stick],
    ["Hit", BlackJackAction.Hit],
  ]);

  public static readonly _gameStateDim: number[] = [32, 11, 2];

  private _rng: seedrandom.PRNG;
  private _player: BlackJackPlayer;
  private _dealer: BlackJackDealer;
  private _iteration: number = 0;

  constructor(randomSeed?: number) {
    if (randomSeed) {
      this._rng = seedrandom(randomSeed.toString());
    } else {
      this._rng = seedrandom();
    }
    this._player = new BlackJackPlayer(this._rng);
    this._dealer = new BlackJackDealer(this._rng);
  }

  /**
   * Get the game state dimension
   * @type {number[]}
   */
  public static get gameStateDim(): number[] {
    return BlackJackGame._gameStateDim;
  }

  /**
   * Get the player
   * @type {BlackJackPlayer}
   */
  public get player(): BlackJackPlayer {
    return this._player;
  }

  /**
   * Get the dealer
   * @type {BlackJackDealer}
   */
  public get dealer(): BlackJackDealer {
    return this._dealer;
  }

  /**
   * Get the action space
   * @type {string[]}
   */
  public static get actionSpace(): string[] {
    return Array.from(BlackJackGame.actionMapping.keys());
  }

  /**
   * Get The return
   * @type {number}
   */
  public get return(): number {
    if (!this.isTerminal) return 0;
    if (this._player.score > 21) return -1;
    if (this._dealer.score > 21) return 1;
    const playerScore = Math.abs(this._player.score - 21);
    const dealerScore = Math.abs(this._dealer.score - 21);
    if (playerScore < dealerScore) return 1;
    if (playerScore > dealerScore) return -1;
    return 0;
  }

  /**
   * Return whether the game has terminated
   * @type {boolean}
   */
  public get isTerminal(): boolean {
    return this._dealer.sticks && this._player.sticks;
  }

  /**
   * Get the games state
   * @type {BlackJackGameState}
   */
  public get gameState(): BlackJackGameState {
    return {
      playerScore: this._player.score,
      shownCard: this._dealer.shownCard,
      playerHoldsUsableAce: this._player.hasUsableAce,
    };
  }

  /**
   * Get the iteration
   * @type {number}
   */
  public get iteration(): number {
    return this._iteration;
  }

  /**
   * initialize the game
   * @returns {void}
   */
  public initGame(): void {
    this._player.init();
    this._dealer.init();
    const playerHasNat = this.playerHasNatural();
    if (playerHasNat) {
      this.endGame();
    }
  }

  /**
   * Set the random seed
   * @type {number}
   */
  public set randomSeed(randomSeed: number) {
    this._rng = seedrandom(randomSeed.toString());
    this.reset(true);
  }

  /**
   * Return whether the player has a natural blackjack
   * @returns {boolean} whether the player has a natural blackjack
   */
  public playerHasNatural(): boolean {
    if (this._player.score === 21) return true;
    return false;
  }

  /**
   * Make an environment step
   * @param {BlackJackActionKey} actionString The action
   * @returns {StepResult} The result
   */
  public step(
    actionString: BlackJackActionKey
  ): StepResult<BlackJackGameState> {
    this._iteration++;
    const action: BlackJackAction | undefined =
      BlackJackGame.actionMapping.get(actionString);

    if (action === undefined) {
      throw Error("Illegal Action");
    }

    switch (action) {
      case BlackJackAction.Hit:
        const newCard = BlackJackCard.returnRandomCard(this._rng);
        this._player.addCard(newCard);
        if (this._player.score > 21) {
          this.endGame();
        }
        break;
      case BlackJackAction.Stick:
        this._player.callStick();
        this.simulateDealer();
        break;
    }

    return {
      newState: this.gameState,
      reward: this.return,
    };
  }

  /**
   * Simulate the dealer
   * @returns {void}
   */
  public simulateDealer(): void {
    while (!this._dealer.sticks) {
      this._dealer.act();
    }
  }

  /**
   * Encode the state to a number encoded array
   * @param {BlackJackGameState} state the state
   * @returns the encoded array
   */
  public static encodeStateToIndices(state: BlackJackGameState): number[] {
    return [
      state.playerScore,
      state.shownCard!.value,
      Number(state.playerHoldsUsableAce),
    ];
  }

  /**
   * End the game
   * @returns {void}
   */
  public endGame(): void {
    this._player.callStick();
    this._dealer.callStick();
  }

  /**
   * Reset the game
   * @param {boolean} [reinit=true] Whether to reinitialize the game
   * @returns {boolean}
   */
  public reset(reinit = true): boolean {
    this._iteration = 0;
    this._player.reset();
    this._dealer.reset();
    if (reinit) {
      this.initGame();
    }
    return true;
  }
}

export default BlackJackGame;
