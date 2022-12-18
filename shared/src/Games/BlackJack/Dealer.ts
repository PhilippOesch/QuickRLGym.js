import { BlackJackPlayer, BlackJackCard } from '../BlackJack/index';

export default class BlackJackDealer extends BlackJackPlayer {
    private shownCard: BlackJackCard;

    public get getShownCard(): BlackJackCard {
        return this.shownCard;
    }

    public init() {
        this.shownCard = BlackJackCard.returnRandomCard(this.rng);
        // add two cards to the actors deck
        this.addCard(this.shownCard);
        this.addCard(BlackJackCard.returnRandomCard(this.rng));
    }

    public act(): void {
        if (this.getScore < 17) {
            this.addCard(BlackJackCard.returnRandomCard(this.rng));
        } else {
            this.callStick();
        }
    }
}
