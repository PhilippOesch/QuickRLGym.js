import { TaxiGame, TaxiGameState } from '../Games/TaxiGame/index';
import { StepResult } from '../index';
import SingleAgentEnvironment from '../RLInterface/Environment';

export default class TaxiEnv extends SingleAgentEnvironment {
    private game: TaxiGame;

    constructor(game: TaxiGame, initialGameState?: TaxiGameState) {
        super(initialGameState);
        this.game = game;
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

    public get getReward(): number {
        return this.game.getPayoff;
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
        return this.game.encodeStateToIndices(state);
    }
}
