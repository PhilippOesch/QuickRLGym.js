import { Game } from "../../../shared/src";
import Agent from "./Agent";

abstract class SingleAgentEnvironment {
    protected game: Game;
    protected agent?: Agent;
    protected initialGameState?: object;

    constructor(game: any, initialGameState?: object) {
        this.game = game;
        this.initialGameState = initialGameState;
    }

    public set setAgent(agent: Agent) {
        this.agent = agent;
    }

    public abstract initGame(): void;

    public train(
        iterations: number = 100,
        logEvery = 10,
        maxIterationPerGame: number = 100
    ): void {
        this.game.reset(true, this.initialGameState);

        if (this.agent == undefined) {
            throw new Error("No Agent has been set");
        }

        let averageGameIterations = 0;
        let count = 0;
        for (let i = 0; i < iterations; i++) {
            while (
                !this.game.getIsTerminal &&
                this.game.getIteration < maxIterationPerGame
            ) {
                const prevState: object = this.game.getGameState;
                const nextAction: string = this.agent.step(this.getGameState);
                const { newState, reward } = this.game.step(nextAction);
                this.agent.feed(prevState, nextAction, newState, reward);
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
            const isReset = this.reset();
            if (!isReset) {
                break;
            }
        }
    }

    public abstract get getGameState(): object;

    public abstract reset(): boolean;
}

export default SingleAgentEnvironment;
