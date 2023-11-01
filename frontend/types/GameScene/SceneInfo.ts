import StaticRenderScene from '~/utils/GameScenes/StaticRenderScene';
import { SingleAgentEnvironment } from 'quickrl.core';

type SceneInfo = {
    gameScene?: StaticRenderScene;
    env?: SingleAgentEnvironment;
    game?: Phaser.Game;
};

export default SceneInfo;
