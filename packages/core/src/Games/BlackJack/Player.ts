import BlackJackCard from './Card';
import seedrandom from 'seedrandom';

/**
 * A blackjack player
 * @category Games
 * @subcategory BlackJack
 * @param {seedrandom.PRNG} rng the random number generator
 */
class BlackJackPlayer {
    protected _currentCard?: BlackJackCard;
    protected _sticks: boolean = false;
    protected rng: seedrandom.PRNG;
    protected _cardHistory: BlackJackCard[] = [];

    constructor(rng: seedrandom.PRNG) {
        this.rng = rng;
    }

    /**
     * The players score
     * @type {number}
     */
    public get score(): number {
        if (this.hasUsableAce) return this.cardSum + 10;
        return this.cardSum;
    }

    /**
     * The sum of all player cards
     * @type {number}
     */
    public get cardSum(): number {
        let sum = 0;

        for (let i = 0; i < this._cardHistory.length; i++) {
            sum += this._cardHistory[i].value;
        }

        return sum;
    }

    /**
     * The players current card
     * @type {BlackJackCard | undefined}
     */
    public get currentCard(): BlackJackCard | undefined {
        return this._currentCard;
    }

    /**
     * Get whether the player sticks
     * @type {boolean}
     */
    public get sticks(): boolean {
        return this._sticks;
    }

    /**
     * Return whether the player has a usable ace
     * @type {boolean}
     */
    public get hasUsableAce(): boolean {
        const cardSum = this.cardSum;
        const aceInHand = this._cardHistory.find((element) => {
            return element.value === 1;
        });
        return aceInHand != undefined && cardSum + 10 <= 21;
    }

    /**
     * Get the players card history
     * @type {BlackJackCard[]}
     */
    public get cardHistory(): BlackJackCard[] {
        return this._cardHistory;
    }

    /**
     * Initialize the player
     * @returns {void}
     */
    public init(): void {
        // add two cards to the actors deck
        this.addCard(BlackJackCard.returnRandomCard(this.rng));
        this.addCard(BlackJackCard.returnRandomCard(this.rng));
    }

    /**
     * Reset the player
     * @return {void}
     */
    public reset(): void {
        this._currentCard = undefined;
        this._cardHistory = [];
        this._sticks = false;
    }

    /**
     * call stick
     * @returns {void}
     */
    public callStick(): void {
        this._sticks = true;
    }

    /**
     * hand the player a card
     * @param {BlackJackCard} blackJackCard The card to hand
     * @returns {void}
     */
    public addCard(blackJackCard: BlackJackCard): void {
        this._currentCard = blackJackCard;
        this._cardHistory.push(blackJackCard);
    }
}

export default BlackJackPlayer;
