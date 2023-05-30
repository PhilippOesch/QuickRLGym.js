import BlackJackCard from './Card';
import BlackJackPlayer from './Player';

/**
 * The card object
 * @category Games
 * @subcategory BlackJack
 * @extends BlackJackPlayer
 */
class BlackJackDealer extends BlackJackPlayer {
    private _shownCard: BlackJackCard;

    /**
     * The dealers shown card
     * @type {BlackJackCard}
     */
    public get shownCard(): BlackJackCard {
        return this._shownCard;
    }

    /**
     * Initialize the dealer
     * @returns {void}
     */
    public init(): void {
        this._shownCard = BlackJackCard.returnRandomCard(this.rng);
        // add two cards to the actors deck
        this.addCard(this._shownCard);
        this.addCard(BlackJackCard.returnRandomCard(this.rng));
    }

    /**
     * Let the dealer act
     * @returns {void}
     */
    public act(): void {
        if (this.score < 17) {
            this.addCard(BlackJackCard.returnRandomCard(this.rng));
        } else {
            this.callStick();
        }
    }
}

export default BlackJackDealer;
