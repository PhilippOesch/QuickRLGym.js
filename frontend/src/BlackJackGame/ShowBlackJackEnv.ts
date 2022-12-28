import { Agent, Envs, Games } from '../../../coreLibary/src';
import BlackJackGameScene from './BlackJackGameScene';

export interface ShowBlackJackOptions {
    randomSeed?: number;
    interactiveMode: boolean;
    loopEndless?: boolean;
}

export default class ShowBlackJackEnv {
    private agent: Agent;
    private game: Games.BlackJack.BlackJackGame;
    private env: Envs.BlackJackEnv;
    private gameScene: BlackJackGameScene;

    constructor(options?: ShowBlackJackOptions) {
        if (options) {
            this.env = new Envs.BlackJackEnv({
                randomSeed: options.randomSeed,
            });
            // set game scene
            this.gameScene = new BlackJackGameScene(
                this.env,
                options.interactiveMode,
                options.loopEndless
            );
        } else {
            this.env = new Envs.BlackJackEnv();
            this.gameScene = new BlackJackGameScene(this.env, false);
        }
        console.log(this.env);
        this.game = this.env.getGame;
    }

    public get getEnv(): Envs.BlackJackEnv {
        return this.env;
    }

    public set setAgent(agent: Agent) {
        this.agent = agent;
    }

    public async init() {
        this.game.initGame();
        this.game.reset(true);
        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            parent: 'app',
            width: 500,
            height: 500,
            backgroundColor: '#1e4d1f',
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
    ) {
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
            this.game.reset(true);
            this.startGame(loopEndless, timeBetweenMoves, maxIterations);
        }
        await new Promise((f) => setTimeout(f, 500));
        this.gameScene.reRender();
    }
}
