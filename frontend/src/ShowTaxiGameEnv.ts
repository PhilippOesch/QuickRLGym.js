import {
    TaxiGame,
    TaxiGlobals,
    TaxiGameState,
} from '../../shared/src/Games/TaxiGame';
import { TaxiEnv } from '../../shared/src';
import BrowserAgent from './Agents/BrowserAgent';
import TaxiGameScene from './TaxiGameScene';

export interface ShowTaxiOptions {
    randomSeed?: number;
    interactiveMode: boolean;
    loopEndless?: boolean;
}

export default class ShowTaxiGameEnv {
    private agent: BrowserAgent;
    private game: TaxiGame;
    private env: TaxiEnv;
    private gameScene: TaxiGameScene;
    private initialGameState?: TaxiGameState;

    constructor(options?: ShowTaxiOptions, initialGameState?: TaxiGameState) {
        if (options) {
            this.env = new TaxiEnv({ randomSeed: options.randomSeed });
            this.gameScene = new TaxiGameScene(
                this.env,
                options.interactiveMode,
                options.loopEndless
            );
        } else {
            this.env = new TaxiEnv();
            this.gameScene = new TaxiGameScene(this.env, false);
        }
        console.log(this.env);
        this.game = this.env.getGame;
        this.initialGameState = initialGameState;
    }

    public get getEnv(): TaxiEnv {
        return this.env;
    }

    public set setAgent(agent: BrowserAgent) {
        this.agent = agent;
    }

    public async init() {
        await this.agent.load();
        this.game.initGame();
        this.game.reset(true, this.initialGameState);
        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            parent: 'app',
            width: TaxiGlobals.tileWidth * 11 * TaxiGlobals.scale,
            height: TaxiGlobals.tileHeight * 7 * TaxiGlobals.scale,
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
        timeBetweenMoves: number = 100
    ) {
        if (this.agent == undefined) {
            throw Error(
                'an agent has to be defined when not running in Interactive mode'
            );
        }

        await new Promise((f) => setTimeout(f, 1000));

        while (!this.game.getIsTerminal) {
            await new Promise((f) => setTimeout(f, timeBetweenMoves));
            const nextAction = this.agent.evalStep(this.game.getGameState);
            this.game.step(nextAction);
            this.gameScene.reRender();
        }

        if (loopEndless) {
            this.game.reset(false, this.initialGameState);
            this.startGame(loopEndless, timeBetweenMoves);
        }
        await new Promise((f) => setTimeout(f, 500));
        this.gameScene.reRender();
    }
}
