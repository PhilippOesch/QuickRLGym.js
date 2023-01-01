import QuickRLJS, { Envs, Games, Agents } from 'quickrl.core';
import TaxiGameScene from '../utils/GameScenes/TaxiGameScene';

export interface TaxiSceneInfo {
    gameScene: TaxiGameScene;
    env: Envs.TaxiEnv;
}

export default async function useGameEnv(
    parent: HTMLElement
): Promise<TaxiSceneInfo> {
    //const env = Q;
    const env = QuickRLJS.loadEnv('Taxi') as Envs.TaxiEnv;
    const randAgent = new Agents.RandomAgent(env);
    env.setAgent = randAgent;
    env.initAgent();

    const gameScene = new TaxiGameScene(env, false);
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
        scene: gameScene,
    };
    new Phaser.Game(config);
    return {
        gameScene: gameScene,
        env: env,
    };
}
