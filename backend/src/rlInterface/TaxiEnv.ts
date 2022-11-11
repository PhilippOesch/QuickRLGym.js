import Agent from "./Agent";
import { GameState } from "../../../shared/src/";
import { TaxiGame } from "../../../shared/src/";

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

    public train(iterations: number = 100, logEvery = 10) {
        if (this.agent == undefined) {
            throw Error("The Agent is not defined");
        }

        this.game.reset(true, this.initialGameState);

        let averageGameIterations = 0;
        let count = 0;
        for (let i = 0; i < iterations; i++) {
            while (!this.game.getIsTerminal && this.game.getIteration < 25) {
                const prevState: GameState = this.game.getGameState;
                const nextAction: string = this.agent.step(this.getGameState);
                const { newState, reward } = this.game.step(nextAction);
                // console.log("prevState", prevState);
                // console.log("newState", newState);
                // console.log("action", nextAction);
                // console.log("reward", reward);
                this.agent.feed(prevState, nextAction, newState, reward);
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
            const isReset = this.reset();
            if (!isReset) {
                break;
            }
        }
    }

    public reset(): Promise<boolean> {
        return this.game.reset(true, this.initialGameState);
    }

    public get getGameState(): GameState {
        return this.game.getGameState;
    }
}
