import seedrandom from 'seedrandom';

export default class BlackJackCard {
    public static suits: string[] = ['Clubs', 'Diamonds', 'Hearts', 'Spades'];
    public static ranks: string[] = [
        'Ace',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        'Jack',
        'Queen',
        'King',
    ];

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
    private rank: string;

    constructor(suit: string, rank: string) {
        this.suit = suit;
        this.rank = rank;
    }

    public get getSuit(): string {
        return this.suit;
    }

    public get getRank(): string {
        return this.rank;
    }

    public toString(): string {
        return `${this.rank}-${this.suit}`;
    }

    public get getValue(): number {
        const value10Set: Set<string> = new Set(['Jack', 'Queen', 'King']);
        if (isNaN(Number(this.rank))) {
            if (value10Set.has(this.rank)) return 10;

            return 1;
        }
        return Number(this.rank);
    }
}
