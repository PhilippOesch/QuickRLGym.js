import {
    Envs,
    Games,
    SingleAgentEnvironment,
    QuickRLJS,
    Agents,
} from 'quickrl.core';
import BlackJackGameScene from '~/utils/GameScenes/BlackJack/BlackJackGameScene';
import StaticRenderScene from '~~/utils/GameScenes/helpers';
import TaxiGameScene from '~~/utils/GameScenes/TaxiGameScene';

export interface SceneInfo {
    gameScene?: StaticRenderScene;
    env?: SingleAgentEnvironment;
    game?: Phaser.Game;
}

function loadEnv(name: string) {
    const env: SingleAgentEnvironment = QuickRLJS.loadEnv(
        name
    ) as SingleAgentEnvironment;
    const randAgent = new Agents.RandomAgent(env);
    env.agent = randAgent;
    env.initAgent();
    return env;
}

export default function useGameSceneFactory(
    name: string,
    parent: HTMLElement
): SceneInfo | undefined {
    const env = loadEnv(name);

    switch (name) {
        case 'Taxi':
            const taxiScene: TaxiGameScene = new TaxiGameScene(
                <Envs.TaxiEnv>env,
                false
            );
            return createTaxiScene(taxiScene, <Envs.TaxiEnv>env, parent);
        case 'BlackJack':
            const blackJackScene: BlackJackGameScene = new BlackJackGameScene(
                <Envs.BlackJackEnv>env,
                false
            );
            return createBlackJackScene(
                blackJackScene,
                <Envs.BlackJackEnv>env,
                parent
            );
    }
    return undefined;
}

function createBlackJackScene(
    scene: BlackJackGameScene,
    env: Envs.BlackJackEnv,
    parent: HTMLElement
): SceneInfo {
    env.game.initGame();
    env.game.reset(true);
    const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        parent: parent,
        width: 700,
        height: 250,
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
        scale: {
            // Fit to window
            mode: Phaser.Scale.WIDTH_CONTROLS_HEIGHT,
            // Center vertically and horizontally
            autoCenter: Phaser.Scale.CENTER_BOTH,
        },
        scene: scene,
    };
    // console.log(this.game.getGameState);
    const game = new Phaser.Game(config);
    return {
        gameScene: scene,
        env: env,
        game: game,
    };
}

function createTaxiScene(
    scene: TaxiGameScene,
    env: Envs.TaxiEnv,
    parent: HTMLElement
): SceneInfo {
    const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        parent: parent,
        width:
            Games.Taxi.TaxiGlobals.tileWidth *
            11 *
            Games.Taxi.TaxiGlobals.scale,
        height:
            Games.Taxi.TaxiGlobals.tileHeight *
            7 *
            Games.Taxi.TaxiGlobals.scale,
        scale: {
            // Fit to window
            mode: Phaser.Scale.WIDTH_CONTROLS_HEIGHT,
            // Center vertically and horizontally
            autoCenter: Phaser.Scale.CENTER_BOTH,
        },
        physics: {
            default: 'arcade',
            arcade: {
                gravity: {
                    y: 0,
                },
            },
        },
        scene: scene,
    };
    const game = new Phaser.Game(config);
    return {
        gameScene: scene,
        env: env,
        game: game,
    };
}
