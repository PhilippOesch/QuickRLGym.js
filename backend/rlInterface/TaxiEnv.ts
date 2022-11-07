import Agent from "./Agent";
import GameState from "../../shared/game/GameState";
import Utils from "../../shared/Utils";
import TaxiGame from "../../shared/game/TaxiGame";

export default class TaxiEnv {
    private game: TaxiGame;
    private agent?: Agent;
    private visualize: boolean;
    private isInteractive: boolean;
    private log: boolean;

    constructor(game: TaxiGame, agent?: Agent, log: boolean = false) {
        this.game = game;
        this.agent = agent;
        this.log = log;
    }

    public initGame(isInteractive: boolean = false): void {
        this.isInteractive = isInteractive;
        this.game.initGame();
        if (this.agent) {
            this.agent.init();
        }
    }

    public async startGame(): Promise<void> {
        if (!this.isInteractive && this.agent == undefined) {
            throw Error(
                "an agent has to be defined when not running in Interactive mode"
            );
        }

        if (!this.isInteractive && this.agent != undefined) {
            if (!this.isInteractive) {
                if (this.visualize)
                    await new Promise((f) => setTimeout(f, 500));
                while (!this.game.getIsTerminal) {
                    const nextAction: string = this.agent.evalStep(
                        this.getGameState
                    );
                    this.game.step(nextAction);
                    if (this.log) {
                        Utils.logGameState(this.game.getGameState);
                    }
                }
                if (this.log) {
                    console.log("Final State");
                    Utils.logGameState(this.game.getGameState);
                }
            }
        }
    }

    public train(iterations: number = 100) {
        if (this.agent == undefined) {
            throw Error("The Agent is not defined");
        }

        for (let i = 0; i < iterations; i++) {
            while (!this.game.getIsTerminal && this.game.getIteration < 25) {
                const prevState: GameState = this.game.getGameState;
                const nextAction: string = this.agent.step(
                    this.getGameState,
                    i
                );
                this.game.step(nextAction);
                this.agent.feed(
                    prevState,
                    nextAction,
                    this.game.getGameState,
                    this.game.getPayoff
                );
            }
            if (i % 1000 === 0) {
                console.log("Iteration", i);
                this.agent.log();
            }
            this.reset();
        }
    }

    public reset() {
        this.game.reset();
    }

    public get getGameState(): GameState {
        return this.game.getGameState;
    }
}
