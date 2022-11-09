import Agent from "./Agent";
import GameState from "../../shared/game/GameState";
import TaxiGame from "../../shared/game/TaxiGame";

export default class TaxiEnv {
    private game: TaxiGame;
    private agent?: Agent;
    private initialGameState?: GameState;

    constructor(game: TaxiGame, agent?: Agent, initialGameState?: GameState) {
        this.game = game;
        this.agent = agent;
        this.initialGameState = initialGameState;
    }

    public initGame(): void {
        this.game.initGame();
        if (this.agent) {
            this.agent.init();
        }
    }

    public async train(iterations: number = 100, logEvery = 10) {
        if (this.agent == undefined) {
            throw Error("The Agent is not defined");
        }

        await this.game.reset(true, this.initialGameState);

        let averageGameIterations = 0;
        let count = 0;
        for (let i = 0; i < iterations; i++) {
            while (!this.game.getIsTerminal && this.game.getIteration < 25) {
                const prevState: GameState = this.game.getGameState;
                const nextAction: string = this.agent.step(this.getGameState);
                const action = this.game.step(nextAction);
                const newState = this.game.getGameState;
                const payoff = this.game.getPayoff;
                this.agent.feed(prevState, action, newState, payoff);
                //this.agent.log();
                //console.log(this.game.getIteration);
            }
            count++;
            averageGameIterations += this.game.getIteration;
            if (i % logEvery == 0) {
                console.log(
                    "averageGameIterations:",
                    averageGameIterations / count
                );
                console.log("Iteration:", i);
                this.agent.log();
                averageGameIterations = 0;
                count = 0;
            }
            const isReset = await this.reset();
            if (!isReset) {
                break;
            }
        }
    }

    public async reset(): Promise<boolean> {
        return this.game.reset(true, this.initialGameState);
    }

    public get getGameState(): GameState {
        return this.game.getGameState;
    }
}
