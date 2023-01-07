import { Scene } from 'phaser';

export default abstract class StaticRenderScene extends Scene {
    abstract get gameInfo(): object;
    abstract reRender(): void;
}
