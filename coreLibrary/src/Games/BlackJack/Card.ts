import seedrandom from 'seedrandom';

export default class BlackJackCard {
    public static suits: string[] = ['clubs', 'diamonds', 'hearts', 'spades'];
    public static ranks: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

    public static returnRandomCard(rng?: seedrandom.PRNG): BlackJackCard {
        let randomNumSuit;
        let randomNumRank;
        if (rng) {
            randomNumSuit = Math.floor(rng() * BlackJackCard.suits.length);
            randomNumRank = Math.floor(rng() * BlackJackCard.ranks.length);
        } else {
            randomNumSuit = Math.floor(
                Math.random() * BlackJackCard.suits.length
            );
            randomNumRank = Math.floor(
                Math.random() * BlackJackCard.ranks.length
            );
        }

        return new BlackJackCard(
            BlackJackCard.suits[randomNumSuit],
            BlackJackCard.ranks[randomNumRank]
        );
    }

    private suit: string;
    private rank: number;

    constructor(suit: string, rank: number) {
        this.suit = suit;
        this.rank = rank;
    }

    public get getSuit(): string {
        return this.suit;
    }

    public get getRank(): number {
        return this.rank;
    }

    public toString(): string {
        return `${this.suit}-${this.rank}`;
    }

    public get getValue(): number {
        if (this.rank >= 10) {
            return 10;
        }
        return this.rank;
    }
}
