import Agent from "../interfaces/Agent";
import GameState from "../interfaces/GameState";
import TaxiGame from "./TaxiGame";

export default class TaxiEnv {
    private game: TaxiGame;
    private agent?: Agent;
    private visualize: boolean;
    private isInteractive: boolean;

    constructor(game: TaxiGame, agent?: Agent) {
        this.game = game;
        this.agent = agent;
    }

    public initGame(visualize: boolean, isInteractive: boolean): void {
        this.visualize = visualize;
        this.isInteractive = isInteractive;
        this.game.initGame();
    }

    public startGame(): void {
        if (!this.isInteractive && this.agent == undefined) {
            throw Error(
                "an agent has to be defined when not running in Interactive mode"
            );
        }

        if (!this.isInteractive && this.agent != undefined) {
            this.agent.init();
            if (!this.isInteractive) {
                while (!this.game.getGameStateManager.getIsTerminal) {
                    this.agent.step(this.getGameState);
                }
            }
        }
    }

    public get getGameState(): GameState {
        return this.game.getGameState;
    }
}
