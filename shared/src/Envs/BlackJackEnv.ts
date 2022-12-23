import { SingleAgentEnvironment, StepResult } from '../index';
import { BlackJackGame, BlackJackGameState } from '../Games/BlackJack/index';

export interface BlackJackOptions {
    randomSeed: number;
}

export default class BlackJackEnv extends SingleAgentEnvironment {
    private game: BlackJackGame;
    private logIntervalCount: number = 0;
    private averagePlayerScore: number = 0;
    private averageReturn: number = 0;
    private averageDealerScore: number = 0;

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

    public get getGameStateDim(): number[] {
        return this.game.getGameStateDim;
    }

    public get getActionSpace(): string[] {
        return BlackJackGame.getActionSpace;
    }
    public initEnv(): void {
        this.game.initGame();
        super.initEnv();
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

    public override onIterationEnd(): void {
        this.logIntervalCount++;
        const currentState = this.getState as BlackJackGameState;
        this.averagePlayerScore += currentState.playerScore;
        this.averageReturn += this.getReturn;
        this.averageDealerScore += this.game.getDealer.getScore;
    }

    public override log(trainIteration: number): void {
        console.log('Iteration:', trainIteration);
        console.log(
            'Average Player Score:',
            this.averagePlayerScore / this.logIntervalCount
        );
        console.log(
            'Average Return:',
            this.averageReturn / this.logIntervalCount
        );
        console.log(
            'Average Dealer Score:',
            this.averageDealerScore / this.logIntervalCount
        );
        this.averagePlayerScore = 0;
        this.logIntervalCount = 0;
        this.averageReturn = 0;
        this.averageDealerScore = 0;
    }
}
