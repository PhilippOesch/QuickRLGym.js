import BlackJackCard from './Card';

interface BlackJackGameState {
    playerScore: number;
    shownCard: BlackJackCard;
    playerHoldsUsableAce: boolean;
}

export default BlackJackGameState;
