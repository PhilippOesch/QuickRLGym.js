import BlackJackCard from './Card';
import seedrandom from 'seedrandom';

export default class BlackJackPlayer {
    protected score: number = 0;
    protected currentCard: BlackJackCard;
    protected holdsAce: boolean = false;
    protected sticks: boolean = false;
    protected rng: seedrandom.PRNG;

    constructor(rng: seedrandom.PRNG) {
        this.rng = rng;
    }

    public init() {
        // add two cards to the actors deck
        this.addScore(BlackJackCard.returnRandomCard(this.rng));
        this.addScore(BlackJackCard.returnRandomCard(this.rng));
    }

    public get getScore(): number {
        return this.score;
    }

    public get getCurrentCard(): BlackJackCard {
        return this.currentCard;
    }

    public get getHoldsAce(): boolean {
        return this.holdsAce;
    }

    public get getStick(): boolean {
        return this.sticks;
    }

    public callStick(): void {
        this.sticks = true;
    }

    public addScore(blackJackCard: BlackJackCard): void {
        this.currentCard = blackJackCard;
        if (blackJackCard.getRank === 'Ace' && this.score < 11) {
            this.score += this.currentCard.getValue(true);
            this.holdsAce = true;
        } else {
            this.score += this.currentCard.getValue(false);
        }
    }
}
