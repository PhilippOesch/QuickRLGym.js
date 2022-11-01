import Globals from "../Globals";
import Agent from "../interfaces/Agent";
import GameState from "../interfaces/GameState";
import Utils from "../Utils";
import GameScene from "./GameScene";
import TaxiGame from "./TaxiGame";

export default class TaxiEnv {
    private game: TaxiGame;
    private agent?: Agent;
    private visualize: boolean;
    private isInteractive: boolean;
    private gameScene?: GameScene;
    private log: boolean;

    constructor(game: TaxiGame, agent?: Agent, log: boolean = false) {
        this.game = game;
        this.agent = agent;
        this.log = log;
    }

    public initGame(isInteractive: boolean, visualize: boolean): void {
        this.visualize = visualize;
        this.isInteractive = isInteractive;
        this.game.initGame();
    }

    public async startGame(loopEndless: boolean = false): Promise<void> {
        if (!this.isInteractive && this.agent == undefined) {
            throw Error(
                "an agent has to be defined when not running in Interactive mode"
            );
        }

        if ((this.isInteractive || this.visualize) && !this.gameScene) {
            this.setupScene(loopEndless);
        }

        if (!this.isInteractive && this.agent != undefined) {
            this.agent.init();
            if (!this.isInteractive) {
                if (this.visualize)
                    await new Promise((f) => setTimeout(f, 500));
                while (!this.game.getGameStateManager.getIsTerminal) {
                    const nextAction: string = this.agent.step(
                        this.getGameState
                    );
                    this.game.step(nextAction);
                    if (this.visualize) {
                        await new Promise((f) => setTimeout(f, 20));
                        this.gameScene!.reRender();
                    } else if (this.log) {
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

    public async train(iterations: number = 100) {
        if (this.agent == undefined) {
            throw Error("The Agent is not defined");
        }

        if (this.visualize && !this.gameScene) {
            this.setupScene();
        }

        for (let i = 0; i < iterations; i++) {
            if (this.visualize) await new Promise((f) => setTimeout(f, 500));
            while (!this.game.getGameStateManager.getIsTerminal) {
                const nextAction: string = this.agent.step(this.getGameState);
                this.game.step(nextAction);
                if (this.visualize) {
                    await new Promise((f) => setTimeout(f, 20));
                    this.gameScene!.reRender();
                }
            }
            if (this.log) {
                console.log("Iteration " + i);
                Utils.logGameState(this.game.getGameState);
            }
            this.reset();
        }
    }

    public reset() {
        this.game.reset();
    }

    private setupScene(loopEndless: boolean = false): void {
        this.gameScene = new GameScene(
            this.game,
            this.isInteractive,
            loopEndless
        );

        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            parent: "app",
            width: Globals.tileWidth * 11 * Globals.scale,
            height: Globals.tileHeight * 7 * Globals.scale,
            zoom: 1,
            physics: {
                default: "arcade",
                arcade: {
                    gravity: {
                        y: 0,
                    },
                },
            },
            scene: this.gameScene,
        };

        new Phaser.Game(config);
    }

    public get getGameState(): GameState {
        return this.game.getGameState;
    }
}
