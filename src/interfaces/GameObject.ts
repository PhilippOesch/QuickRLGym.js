import 'phaser'
import GameScene from '../gameClasses/GameScene';

abstract class GameObject{
    protected scene: GameScene;

    constructor(scene: GameScene){
        this.scene= scene;
    }

    abstract preload(): void
    abstract create(): void; 
}

export default GameObject