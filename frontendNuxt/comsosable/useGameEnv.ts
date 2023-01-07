import { Envs, Games } from 'quickrl.core';
import TaxiGameScene from '~~/utils/GameScenes/TaxiGameScene';

export interface TaxiSceneInfo {
    gameScene: TaxiGameScene;
    env: Envs.TaxiEnv;
    game: Phaser.Game;
}

export default function useStartScene(
    scene: TaxiGameScene,
    env: Envs.TaxiEnv,
    parent: HTMLElement
): TaxiSceneInfo {
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
