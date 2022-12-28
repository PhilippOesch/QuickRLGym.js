// import {
//     TaxiGame,
//     TaxiGlobals,
//     TaxiGameState,
// } from '../../../shared/src/Games/TaxiGame';
import { Agent, Envs, Games } from '../../../coreLibary/src';
import TaxiGameScene from './TaxiGameScene';

export interface ShowTaxiOptions {
    randomSeed?: number;
    interactiveMode: boolean;
    loopEndless?: boolean;
}

export default class ShowTaxiGameEnv {
    private agent: Agent;
    private game: Games.Taxi.TaxiGame;
    private env: Envs.TaxiEnv;
    private gameScene: TaxiGameScene;
    private initialGameState?: Games.Taxi.TaxiGameState;

    constructor(
        options?: ShowTaxiOptions,
        initialGameState?: Games.Taxi.TaxiGameState
    ) {
        if (options) {
            this.env = new Envs.TaxiEnv({ randomSeed: options.randomSeed });
            this.gameScene = new TaxiGameScene(
                this.env,
                options.interactiveMode,
                options.loopEndless
            );
        } else {
            this.env = new Envs.TaxiEnv();
            this.gameScene = new TaxiGameScene(this.env, false);
        }
        console.log(this.env);
        this.game = this.env.getGame;
        this.initialGameState = initialGameState;
    }

    public get getEnv(): Envs.TaxiEnv {
        return this.env;
    }

    public set setAgent(agent: Agent) {
        this.agent = agent;
    }

    public async init() {
        //await this.agent.load();
        this.game.initGame();
        this.game.reset(true, this.initialGameState);
        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            parent: 'app',
            width:
                Games.Taxi.TaxiGlobals.tileWidth *
                11 *
                Games.Taxi.TaxiGlobals.scale,
            height:
                Games.Taxi.TaxiGlobals.tileHeight *
                7 *
                Games.Taxi.TaxiGlobals.scale,
            zoom: 1,
            physics: {
                default: 'arcade',
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
        timeBetweenMoves: number = 100,
        maxIterations: number = -1
    ): Promise<void> {
        if (this.agent == undefined) {
            throw Error(
                'an agent has to be defined when not running in Interactive mode'
            );
        }

        await new Promise((f) => setTimeout(f, 1000));

        while (
            !this.game.getIsTerminal &&
            (maxIterations >= this.game.getIteration || maxIterations == -1)
        ) {
            await new Promise((f) => setTimeout(f, timeBetweenMoves));
            const nextAction = this.agent.evalStep(this.game.getGameState);
            this.game.step(nextAction);
            this.gameScene.reRender();
        }
        if (loopEndless) {
            this.game.reset(true, this.initialGameState);
            this.startGame(loopEndless, timeBetweenMoves, maxIterations);
        }
        await new Promise((f) => setTimeout(f, 500));
        this.gameScene.reRender();
    }
}
