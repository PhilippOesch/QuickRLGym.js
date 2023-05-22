import { StepResult } from '../../index';
import seedrandom from 'seedrandom';
import {
    BlackJackAction,
    BlackJackPlayer,
    BlackJackDealer,
    BlackJackGameState,
    BlackJackCard,
} from './index';

/**
 * The Black Jack implementation is oriented on the logic described in Richard
 * S. Sutton and Andrew G. Barto 'Reinforcement Learning: An Introduction' Example 5.1..
 */
class BlackJackGame {
    public static readonly gameStateDim: number[] = [32, 11, 2];

    public static readonly actionMapping: Map<string, BlackJackAction> =
        new Map([
            ['Stick', BlackJackAction.Stick],
            ['Hit', BlackJackAction.Hit],
        ]);

    private _rng: seedrandom.PRNG;
    private player: BlackJackPlayer;
    private dealer: BlackJackDealer;
    private iteration: number = 0;

    constructor(randomSeed?: number) {
        if (randomSeed) {
            this._rng = seedrandom(randomSeed.toString());
        } else {
            this._rng = seedrandom();
        }
        this.player = new BlackJackPlayer(this._rng);
        this.dealer = new BlackJackDealer(this._rng);
    }

    public static get getGameStateDim(): number[] {
        return BlackJackGame.gameStateDim;
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
        if (!this.getIsTerminal) return 0;
        if (this.player.getScore > 21) return -1;
        if (this.dealer.getScore > 21) return 1;
        const playerScore = Math.abs(this.player.getScore - 21);
        const dealerScore = Math.abs(this.dealer.getScore - 21);
        if (playerScore < dealerScore) return 1;
        if (playerScore > dealerScore) return -1;
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

    public set setRng(randomSeed: number) {
        this._rng = seedrandom(randomSeed.toString());
        this.reset(true);
    }

    public playerHasNatural(): boolean {
        if (this.player.getScore === 21) return true;
        return false;
    }

    public step(actionString: string): StepResult {
        this.iteration++;
        const action: BlackJackAction | undefined =
            BlackJackGame.actionMapping.get(actionString);

        if (action === undefined) {
            throw Error('Illegal Action');
        }

        switch (action) {
            case BlackJackAction.Hit:
                const newCard = BlackJackCard.returnRandomCard(this._rng);
                this.player.addCard(newCard);
                if (this.player.getScore > 21) {
                    this.endGame();
                }
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

    public static encodeStateToIndices(state: BlackJackGameState): number[] {
        return [
            state.playerScore,
            state.shownCard!.getValue,
            Number(state.playerHoldsUsableAce),
        ];
    }

    public endGame(): void {
        this.player.callStick();
        this.dealer.callStick();
    }

    public reset(reinit = true): boolean {
        this.iteration = 0;
        this.player.reset();
        this.dealer.reset();
        if (reinit) {
            this.initGame();
        }
        return true;
    }
}

export default BlackJackGame;
