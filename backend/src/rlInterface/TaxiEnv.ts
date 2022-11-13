import { GameState, TaxiGame } from '../../../shared/src/';
import SingleAgentEnvironment from './Environment';

export default class TaxiEnv extends SingleAgentEnvironment {
    constructor(game: TaxiGame, initialGameState?: GameState) {
        super(game, initialGameState);
    }

    public initGame(): void {
        this.game.initGame();
        if (this.agent) {
            this.agent.init();
        }
    }

    public reset(): boolean {
        return this.game.reset(true, this.initialGameState);
    }

    public get getGameState(): GameState {
        return this.game.getGameState as GameState;
    }
}
