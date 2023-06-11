import { Scene } from 'phaser';
import { Agent, SingleAgentEnvironment } from 'quickrl.core';
import { SceneInfo } from '~~/comsosable/useGameEnv';

export default abstract class StaticRenderScene extends Scene {
    abstract get gameInfo(): object;
    abstract reRender(): void;
}

export interface RenderInfo {
    gameInfo: object | null;
    stats: object | null;
}

export async function renderGame(
    sceneInfo: SceneInfo,
    agent: Agent,
    renderInfo: RenderInfo,
    maxGameIterations: number = 25,
    timeOutBeforeGame: number = 1000,
    renderTimeBetweenMove: number = 100,
    timeOutAfterGame: number = 200
) {
    const env: SingleAgentEnvironment = sceneInfo!.env as any;
    const gameScene: StaticRenderScene = sceneInfo!
        .gameScene as StaticRenderScene;

    env.reset();
    gameScene.reRender();
    await new Promise((f) => setTimeout(f, timeOutBeforeGame));

    while (!env.isTerminal && env.iteration <= maxGameIterations) {
        await new Promise((f) => setTimeout(f, renderTimeBetweenMove));
        const nextAction = agent!.evalStep(env.state);
        env.step(nextAction);
        gameScene.reRender();
        renderInfo.gameInfo = sceneInfo!.gameScene!.gameInfo;
    }
    await new Promise((f) => setTimeout(f, timeOutAfterGame));
}
