import GameState from "../../shared/game/GameState";
import TaxiGame from "../../shared/game/TaxiGame";
import Globals from "../../shared/Globals";
import BrowserAgent from "./Agents/BrowserAgent";
import TaxiGameScene from "./TaxiGameScene";

export default class ShowTaxiGameEnv {
    private agent: BrowserAgent;
    private game: TaxiGame;
    private gameScene: TaxiGameScene;
    private initialGameState?: GameState;

    constructor(
        agent: BrowserAgent,
        game: TaxiGame,
        gameScene: TaxiGameScene,
        initialGameState?: GameState
    ) {
        this.agent = agent;
        this.game = game;
        this.gameScene = gameScene;
        this.initialGameState = initialGameState;
    }

    public async init() {
        await this.agent.load();
        this.game.initGame();
        this.game.reset(true, this.initialGameState);
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
        console.log(this.game.getGameState);
        new Phaser.Game(config);
    }

    public async startGame(
        loopEndless = false,
        timeBetweenMoves: number = 100
    ) {
        if (this.agent == undefined) {
            throw Error(
                "an agent has to be defined when not running in Interactive mode"
            );
        }

        await new Promise((f) => setTimeout(f, 500));

        while (!this.game.getIsTerminal && this.game.getIteration < 25) {
            await new Promise((f) => setTimeout(f, timeBetweenMoves));
            const nextAction = this.agent.evalStep(this.game.getGameState);
            this.game.step(nextAction);
            this.gameScene.reRender();
        }

        if (loopEndless) {
            this.game.reset(true, this.initialGameState);
            this.startGame(loopEndless, timeBetweenMoves);
            this.gameScene.reRender();
        }
    }

    // public async startGame(): Promise<void> {
    //     if (!&& this.agent == undefined) {
    //         throw Error(
    //             "an agent has to be defined when not running in Interactive mode"
    //         );
    //     }

    //     if (!this.isInteractive && this.agent != undefined) {
    //         if (!this.isInteractive) {
    //             if (this.visualize)
    //                 await new Promise((f) => setTimeout(f, 500));
    //             while (!this.game.getIsTerminal) {
    //                 const nextAction: string = this.agent.evalStep(
    //                     this.getGameState
    //                 );
    //                 this.game.step(nextAction);
    //                 if (this.log) {
    //                     Utils.logGameState(this.game.getGameState);
    //                 }
    //             }
    //             if (this.log) {
    //                 console.log("Final State");
    //                 Utils.logGameState(this.game.getGameState);
    //             }
    //         }
    //     }
    // }
}
