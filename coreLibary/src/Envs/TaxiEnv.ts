import { TaxiGame, TaxiGameState } from '../Games/TaxiGame/index';
import { StepResult, SingleAgentEnvironment, EnvOptions } from '../index';

export interface TaxiStats {
    averageGameIterations: number;
    averageGameScore: number;
}

export default class TaxiEnv extends SingleAgentEnvironment {
    private game: TaxiGame;
    private logIntervalCount: number = 0;
    private averageGameIterations: number = 0;
    private averageGameScore: number = 0;

    constructor(options?: EnvOptions, initialGameState?: TaxiGameState) {
        super((options = options), (initialGameState = initialGameState));
        if (options) {
            this.game = new TaxiGame(options.randomSeed);
        } else {
            this.game = new TaxiGame();
        }
    }

    public get getStats(): TaxiStats {
        return {
            averageGameIterations:
                this.averageGameIterations / this.logIntervalCount,
            averageGameScore: this.averageGameScore / this.logIntervalCount,
        };
    }

    public get getGameStateDim(): number[] {
        return this.game.getGameStateDim;
    }

    /**
     * @returns The game object
     */
    public get getGame(): TaxiGame {
        return this.game;
    }

    public get getActionSpace(): string[] {
        return TaxiGame.getActionSpace;
    }

    public get getIsTerminal(): boolean {
        return this.game.getIsTerminal;
    }
    public get getIteration(): number {
        return this.game.getIteration;
    }

    public get getState(): TaxiGameState {
        return this.game.getGameState as TaxiGameState;
    }

    public get getReturn(): number {
        return this.game.getReturn;
    }

    public step(action: string): StepResult {
        return this.game.step(action);
    }

    public initEnv(): void {
        this.game.initGame();
        super.initEnv();
    }

    public reset(): boolean {
        return this.game.reset(true, this.initialState as TaxiGameState);
    }

    public encodeStateToIndices(state: object): number[] {
        return this.game.encodeStateToIndices(state as TaxiGameState);
    }

    public override onIterationEnd(): void {
        this.logIntervalCount++;
        this.averageGameIterations += this.getIteration;
        this.averageGameScore += this.game.getReturn;
    }

    public override log(trainIteration: number): void {
        console.log('Iteration:', trainIteration);
        console.log(
            'average Game Iterations:',
            this.averageGameIterations / this.logIntervalCount
        );
        console.log(
            'average Game Score:',
            this.averageGameScore / this.logIntervalCount
        );
        this.averageGameIterations = 0;
        this.logIntervalCount = 0;
    }
}
