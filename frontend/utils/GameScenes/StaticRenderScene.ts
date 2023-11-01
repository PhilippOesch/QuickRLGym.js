import { Scene } from 'phaser';

abstract class StaticRenderScene extends Scene {
    abstract get gameInfo(): object;
    abstract reRender(): void;
}

export default StaticRenderScene;
