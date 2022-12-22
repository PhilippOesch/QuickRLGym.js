import { StepResult } from '../../index';
import seedrandom from 'seedrandom';
import {
    BlackJackAction,
    BlackJackPlayer,
    BlackJackDealer,
    BlackJackGameState,
    BlackJackCard,
} from '../BlackJack/index';

/**
 * The Black Jack implementation is oriented on the logic described in Richard
 * S. Sutton and Andrew G. Barto 'Reinforcement Learning: An Introduction' Example 5.1..
 */
export default class BlackJackGame {
    public static readonly actionMapping: Map<string, BlackJackAction> =
        new Map([
            ['Stick', BlackJackAction.Stick],
            ['Hit', BlackJackAction.Hit],
        ]);

    private rng: seedrandom.PRNG;
    private player: BlackJackPlayer;
    private dealer: BlackJackDealer;
    private iteration: number = 0;

    constructor(randomSeed?: number) {
        if (randomSeed) {
            this.rng = seedrandom(randomSeed.toString());
        } else {
            this.rng = seedrandom();
        }
        this.player = new BlackJackPlayer(this.rng);
        this.dealer = new BlackJackDealer(this.rng);
    }

    public get getPlayer(): BlackJackPlayer {
        return this.player;
    }

    public get getDealer(): BlackJackDealer {
        return this.dealer;
    }

    public static get getActionSpace(): string[] {
        return Array.from(BlackJackGame.actionMapping.keys());
    }

    public get getReturn(): number {
        const playerScore = Math.abs(this.player.getScore - 21);
        const dealerScore = Math.abs(this.dealer.getScore - 21);
        if (!this.getIsTerminal) return 0;
        if (playerScore > dealerScore) return 1;
        if (playerScore < dealerScore) return -1;
        return 0;
    }

    public get getIsTerminal(): boolean {
        return this.dealer.getStick && this.player.getStick;
    }

    public get getGameState(): BlackJackGameState {
        return {
            playerScore: this.player.getScore,
            shownCard: this.dealer.getShownCard,
            playerHoldsUsableAce: this.player.hasUsableAce,
        };
    }

    public get getIteration(): number {
        return this.iteration;
    }

    public initGame(): void {
        this.player.init();
        this.dealer.init();
        const playerHasNat = this.playerHasNatural();
        if (playerHasNat) {
            this.endGame();
        }
    }

    public playerHasNatural(): boolean {
        if (this.player.getScore == 21) return true;
        return false;
    }

    public step(actionString: string): StepResult {
        this.iteration++;
        const action: BlackJackAction =
            BlackJackGame.actionMapping.get(actionString)!;

        switch (action) {
            case BlackJackAction.Hit:
                const newCard = BlackJackCard.returnRandomCard(this.rng);
                this.player.addCard(newCard);
                break;
            case BlackJackAction.Stick:
                this.player.callStick();
                this.simulateDealer();
                break;
        }

        return {
            newState: this.getGameState,
            reward: this.getReturn,
        };
    }

    public simulateDealer() {
        while (!this.dealer.getStick) {
            this.dealer.act();
        }
    }

    public encodeStateToIndices(state: BlackJackGameState): number[] {
        return [
            state.playerScore,
            state.shownCard ? state.shownCard?.getValue : -1,
            Number(state.playerHoldsUsableAce),
        ];
    }

    public endGame(): void {
        this.player.callStick();
        this.dealer.callStick();
    }

    public reset(): boolean {
        this.iteration = 0;
        this.player.reset();
        this.dealer.reset();
        return true;
    }
}
