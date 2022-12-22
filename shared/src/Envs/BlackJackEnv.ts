import { SingleAgentEnvironment, StepResult } from '../index';
import { BlackJackGame, BlackJackGameState } from '../Games/BlackJack/index';

export interface BlackJackOptions {
    randomSeed: number;
}

export default class BlackJackEnv extends SingleAgentEnvironment {
    private game: BlackJackGame;

    constructor(options?: BlackJackOptions) {
        super(options);
        if (options) {
            this.game = new BlackJackGame(options.randomSeed);
        } else {
            this.game = new BlackJackGame();
        }
    }

    /**
     * @returns The game object
     */
    public get getGame(): BlackJackGame {
        return this.game;
    }

    public get getActionSpace(): string[] {
        return BlackJackGame.getActionSpace;
    }
    public initEnv(): void {
        this.game.initGame();
    }
    public step(action: string): StepResult {
        return this.game.step(action);
    }
    public get getReturn(): number {
        return this.game.getReturn;
    }
    public get getState(): object {
        return this.game.getGameState;
    }
    public reset(): boolean {
        return this.game.reset();
    }
    public get getIsTerminal(): boolean {
        return this.game.getIsTerminal;
    }
    public get getIteration(): number {
        return this.game.getIteration;
    }
    public encodeStateToIndices(state: object): number[] {
        return this.game.encodeStateToIndices(state as BlackJackGameState);
    }
}
