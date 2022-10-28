import 'phaser';
import CarMoveState from '../enums/CarMoveState';
import GameObject from '../interfaces/GameObject';
import Vec2 from '../interfaces/Vec2';
import Utils from '../Utils';

export default class Player implements GameObject{
    private static carMoveMapping: Map<CarMoveState, number>= 
        new Map([
            [CarMoveState.Left, 0],
            [CarMoveState.Right, 1],
            [CarMoveState.Up, 2],
            [CarMoveState.Down, 3],
        ]);

    private scene: Phaser.Scene; // dependecy injection
    private carMoveState: CarMoveState;
    private relPosition: Vec2;

    constructor(scene: Phaser.Scene, relPos: Vec2, carMoveState: CarMoveState = CarMoveState.Left){
        this.scene= scene;
        this.carMoveState= carMoveState;
        this.relPosition= relPos
    }
    preload(): void {
        this.scene.load.spritesheet('taxi', 'assets/car.png', { frameWidth: 90, frameHeight: 80,  });
    }
    create(): void {
        const sprite: Phaser.GameObjects.Image= this.mapCarMoveState(this.carMoveState);
        sprite.setScale(0.2);
        const absPosition= Utils.adjustedToAbsPos(this.relPosition);
        sprite.setPosition(absPosition.x, absPosition.y);
    }

    mapCarMoveState(carMoveState: CarMoveState): Phaser.GameObjects.Image {
        const index: number = Player.carMoveMapping.get(carMoveState)!;
        return this.scene.add.image(24, 24, 'taxi', index);
    }
}