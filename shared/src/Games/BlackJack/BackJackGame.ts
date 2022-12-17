import {
    BlackJackAction,
    BlackJackPlayer,
    BlackJackDealer,
    BlackJackGameState,
} from '../BlackJack/index';
import seedrandom from 'seedrandom';

export default class BlackJackGame {
    public static readonly actionMapping: Map<string, BlackJackAction> =
        new Map([
            ['Stick', BlackJackAction.Stick],
            ['Hit', BlackJackAction.Hit],
        ]);

    private rng: seedrandom.PRNG;
    private player: BlackJackPlayer;
    private dealer: BlackJackDealer;

    constructor(randomSeed?: number) {
        if (randomSeed) {
            this.rng = seedrandom(randomSeed.toString());
        } else {
            this.rng = seedrandom();
        }
        this.player = new BlackJackPlayer(this.rng);
        this.dealer = new BlackJackDealer(this.rng);
    }

    public initGame(): void {
        this.player.init();
        this.dealer.init();
    }

    public getIsTerminal(): boolean {
        return this.dealer.getStick && this.player.getStick;
    }

    public getGameState(): BlackJackGameState {
        return {
            playerScore: this.player.getScore,
            shownCard: this.dealer.getOpenCard,
            playerHoldsUsableAce: this.player.getHoldsAce,
        };
    }

    public encodeStateToIndices(state: BlackJackGameState): number[] {
        return [
            state.playerScore,
            state.shownCard.getValue(false),
            Number(this.player.getHoldsAce),
        ];
    }
}
