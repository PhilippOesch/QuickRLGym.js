import "phaser";
import GameScene from "./gameClasses/GameScene";
import Globals from "./Globals";

export module Main {
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
        scene: GameScene,
    };

    new Phaser.Game(config);

    Phaser.Scene;
}
