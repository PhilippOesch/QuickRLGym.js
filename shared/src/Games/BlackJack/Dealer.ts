import {
    BlackJackPlayer,
    BlackJackCard,
    BlackJackAction,
} from '../BlackJack/index';

export default class BlackJackDealer extends BlackJackPlayer {
    private shownCard: BlackJackCard;

    public get getOpenCard(): BlackJackCard {
        return this.shownCard;
    }

    public init() {
        this.shownCard = BlackJackCard.returnRandomCard(this.rng);
        // add two cards to the actors deck
        this.addScore(this.shownCard);
        this.addScore(BlackJackCard.returnRandomCard(this.rng));
    }

    public act(): BlackJackAction {
        if (this.score < 17) return BlackJackAction.Hit;

        this.callStick();
        return BlackJackAction.Stick;
    }
}
