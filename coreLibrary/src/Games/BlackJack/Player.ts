import BlackJackCard from './Card';
import seedrandom from 'seedrandom';

export default class BlackJackPlayer {
    protected currentCard?: BlackJackCard;
    protected sticks: boolean = false;
    protected rng: seedrandom.PRNG;
    protected cardHistory: BlackJackCard[] = [];

    constructor(rng: seedrandom.PRNG) {
        this.rng = rng;
    }

    public get getScore(): number {
        if (this.hasUsableAce) return this.getCardSum + 10;
        return this.getCardSum;
    }

    public get getCardSum(): number {
        return this.cardHistory.reduce((a, b) => {
            return a + b.getValue;
        }, 0);
    }

    public get getCurrentCard(): BlackJackCard | undefined {
        return this.currentCard;
    }

    public get getStick(): boolean {
        return this.sticks;
    }

    public get hasUsableAce(): boolean {
        const cardSum = this.getCardSum;
        const aceInHand = this.cardHistory.find((element) => {
            return element.getValue === 1;
        });
        return aceInHand != undefined && cardSum + 10 <= 21;
    }

    public get getCardHistory(): BlackJackCard[] {
        return this.cardHistory;
    }

    public init(): void {
        // add two cards to the actors deck
        this.addCard(BlackJackCard.returnRandomCard(this.rng));
        this.addCard(BlackJackCard.returnRandomCard(this.rng));
    }

    public reset(): void {
        this.currentCard = undefined;
        this.cardHistory = [];
        this.sticks = false;
    }

    public callStick(): void {
        this.sticks = true;
    }

    public addCard(blackJackCard: BlackJackCard): void {
        this.currentCard = blackJackCard;
        this.cardHistory.push(blackJackCard);
    }
}
