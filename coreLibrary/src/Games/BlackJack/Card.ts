import seedrandom from 'seedrandom';

/**
 * The card object
 * @param {string} suit the suit
 * @param {string} rank the rank
 * @category Games
 * @subcategory BlackJack
 */
class BlackJackCard {
    /**
     * All possible suits
     * @type {string[]}
     * @readonly
     */
    public static readonly suits: string[] = [
        'clubs',
        'diamonds',
        'hearts',
        'spades',
    ];
    /**
     * All possible ranks
     * @type {number[]}
     * @readonly
     */
    public static ranks: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

    /**
     * Return a random card
     * @param {?seedrandom.PRNG} rng the random number generator
     * @returns {BlackJackCard} a card
     */
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

    private _suit: string;
    private _rank: number;

    constructor(suit: string, rank: number) {
        this._suit = suit;
        this._rank = rank;
    }

    /**
     * The suit
     * @type {string}
     */
    public get suit(): string {
        return this._suit;
    }

    /**
     * The rank
     * @type {number}
     */
    public get rank(): number {
        return this._rank;
    }

    /**
     * Get the string prepresentation
     * @returns {string}
     */
    public toString(): string {
        return `${this._suit}-${this._rank}`;
    }

    /**
     * Get the value
     * @type {number}
     */
    public get value(): number {
        if (this._rank >= 10) {
            return 10;
        }
        return this._rank;
    }
}

export default BlackJackCard;
