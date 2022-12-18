import { TaxiGame, TaxiGameState } from '../Games/TaxiGame/index';
import { StepResult, SingleAgentEnvironment } from '../index';

export default class TaxiEnv extends SingleAgentEnvironment {
    private game: TaxiGame;

    constructor(randomSeed: number, initialGameState?: TaxiGameState) {
        super(initialGameState);
        this.game = new TaxiGame(randomSeed);
    }

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
        if (this.agent) {
            this.agent.init();
        }
    }

    public reset(): boolean {
        return this.game.reset(true, this.initialState as TaxiGameState);
    }

    public encodeStateToIndices(state: object): number[] {
        return this.game.encodeStateToIndices(state as TaxiGameState);
    }
}
