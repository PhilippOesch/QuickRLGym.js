import BlackJackCard from './Card';

/**
 * A blackjack game state
 * @category Games
 * @subcategory BlackJack
 * @property {number} playerScore the players score
 * @property {?BlackJackCard} shownCard the shown card
 * @property {boolean} playerHoldsUsableAce Whether the player holds a usable ace
 */
interface BlackJackGameState {
    playerScore: number;
    shownCard?: BlackJackCard;
    playerHoldsUsableAce: boolean;
}

export default BlackJackGameState;
