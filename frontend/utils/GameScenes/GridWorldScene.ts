import StaticRenderScene from './StaticRenderScene';
import { Games, Envs } from 'quickrl.core';

class GridWorldGameScene extends StaticRenderScene {
    private gridWorldGame: Games.GridWorld.Game;
    private env: Envs.GridWorldEnv;

    constructor(env: Envs.GridWorldEnv) {
        super('Grid World Game');
        this.gridWorldGame = env.game;
        this.env = env;
    }

    get gameInfo(): object {
        return {};
    }
    reRender(): void {
        return;
    }
}

export default GridWorldGameScene;
