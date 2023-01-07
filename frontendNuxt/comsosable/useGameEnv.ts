import {
    Envs,
    Games,
    SingleAgentEnvironment,
    QuickRLJS,
    Agents,
} from 'quickrl.core';
import BlackJackGameScene from '~~/utils/GameScenes/BlackJackGameScene';
import StaticRenderScene from '~~/utils/GameScenes/StaticRenderScene';
import TaxiGameScene from '~~/utils/GameScenes/TaxiGameScene';

export interface SceneInfo {
    gameScene: StaticRenderScene;
    env: SingleAgentEnvironment;
    game: Phaser.Game;
}

function loadEnv(name: string) {
    const env: SingleAgentEnvironment = QuickRLJS.loadEnv(
        name
    ) as SingleAgentEnvironment;
    const randAgent = new Agents.RandomAgent(env);
    env.setAgent = randAgent;
    env.initAgent();
    return env;
}

export default function useGetGameScene(
    name: string,
    parent: HTMLElement
): SceneInfo | undefined {
    const env = loadEnv(name);

    switch (name) {
        case 'Taxi':
            const taxiScene: TaxiGameScene = new TaxiGameScene(
                env as Envs.TaxiEnv,
                false
            );
            return useTaxiScene(taxiScene, env as Envs.TaxiEnv, parent);
        case 'BlackJack':
            const blackJackScene: BlackJackGameScene = new BlackJackGameScene(
                env as Envs.BlackJackEnv,
                false
            );
            return useBlackJackScene(
                blackJackScene,
                env as Envs.BlackJackEnv,
                parent
            );
    }
    return undefined;
}

function useBlackJackScene(
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

function useTaxiScene(
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
