import {
    TaxiGame,
    TaxiGlobals,
    TaxiGameState,
} from '../../shared/src/Games/TaxiGame';
import { TaxiEnv } from '../../shared/src';
import BrowserAgent from './Agents/BrowserAgent';
import TaxiGameScene from './TaxiGameScene';

export default class ShowTaxiGameEnv {
    private agent: BrowserAgent;
    private game: TaxiGame;
    private gameScene: TaxiGameScene;
    private initialGameState?: TaxiGameState;

    constructor(
        agent: BrowserAgent,
        env: TaxiEnv,
        gameScene: TaxiGameScene,
        initialGameState?: TaxiGameState
    ) {
        this.agent = agent;
        this.game = env.getGame;
        this.gameScene = gameScene;
        this.initialGameState = initialGameState;
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
