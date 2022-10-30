import 'phaser';
import CarMoveState from '../enums/CarMoveState';
import Globals from '../Globals';
import GameObject from '../interfaces/GameObject';
import Vec2 from '../interfaces/Vec2';
import Utils from '../Utils';
import GameScene from './GameScene';

export default class Player extends GameObject{
    private static carMoveMapping: Map<CarMoveState, number>= 
        new Map([
            [CarMoveState.Left, 0],
            [CarMoveState.Right, 1],
            [CarMoveState.Up, 2],
            [CarMoveState.Down, 3],
        ]);

    private static moveDirMapping: Map<CarMoveState, Vec2>=
        new Map([
            [CarMoveState.Left, {x:1, y:0}],
            [CarMoveState.Right, {x:-1, y:0}],
            [CarMoveState.Up, {x:0, y:-1}],
            [CarMoveState.Down, {x:0, y:1}],
        ])

    private carMoveState: CarMoveState;
    private relPosition: Vec2;
    private playerSprite: Phaser.GameObjects.Sprite;

    constructor(scene: GameScene, relPos: Vec2, carMoveState: CarMoveState = CarMoveState.Left){
        super(scene)
        this.carMoveState= carMoveState;
        this.relPosition= relPos;
    }
    public preload(): void {
        this.scene.load.spritesheet('taxi', 'assets/car.png', { frameWidth: 90, frameHeight: 80,  });
    }
    public create(): void {
        const index: number = Player.carMoveMapping.get(this.carMoveState)!;
        this.playerSprite = this.scene.add.sprite(24, 24, 'taxi', index);
        this.playerSprite.setScale(0.2);
        const absPosition= Utils.adjustedToAbsPos(this.relPosition);
        this.playerSprite.setPosition(absPosition.x, absPosition.y);
        this.setupMovement();
    }

    private updateSprite(carMoveState: CarMoveState): void {
        const index: number = Player.carMoveMapping.get(carMoveState)!;
        this.playerSprite.setTexture('taxi', index);
    }

    private setupMovement(): void{
        this.scene.input.keyboard.on('keydown-D', () => {
            this.scene.getGameState.incrementIterations();
            let newPosition: Vec2 = Utils.adjustedToAbsPos(this.relPosition);
            newPosition.x += Globals.tileWidth;
            this.updateSprite(CarMoveState.Left);
            this.updatePosition(newPosition, CarMoveState.Left);
        });
        this.scene.input.keyboard.on('keydown-A', () => {
            this.scene.getGameState.incrementIterations();
            let newPosition: Vec2 = Utils.adjustedToAbsPos(this.relPosition);
            newPosition.x -= Globals.tileWidth;
            this.updateSprite(CarMoveState.Right);
            this.updatePosition(newPosition, CarMoveState.Right);
        });
        this.scene.input.keyboard.on('keydown-W', () => {
            this.scene.getGameState.incrementIterations();
            let newPosition: Vec2 = Utils.adjustedToAbsPos(this.relPosition);
            newPosition.y -= Globals.tileHeight;
            this.updateSprite(CarMoveState.Up);
            this.updatePosition(newPosition, CarMoveState.Up);
        });
        this.scene.input.keyboard.on('keydown-S', () => {
            this.scene.getGameState.incrementIterations();
            let newPosition: Vec2 = Utils.adjustedToAbsPos(this.relPosition);
            newPosition.y += Globals.tileHeight;
            this.updateSprite(CarMoveState.Down);
            this.updatePosition(newPosition, CarMoveState.Down);
        });
    }

    private detectCollision(newPos: Vec2): boolean{
        const tile: Phaser.Tilemaps.Tile = this.scene.getGameMap.getLayer.getTileAtWorldXY(newPos.x, newPos.y);
        return tile.index== 5;
    }

    private updatePosition(newPos: Vec2, carMoveState: CarMoveState): void{
        console.log(this.scene.getGameState.getIterations)
        if(!this.detectCollision(newPos)){
            this.carMoveState= carMoveState;
            const moveDir: Vec2= Player.moveDirMapping.get(this.carMoveState)!;
            this.relPosition.x += moveDir.x;
            this.relPosition.y += moveDir.y;
            const adjustedToAbsPos: Vec2 = Utils.adjustedToAbsPos(this.relPosition);
            this.playerSprite.x= adjustedToAbsPos.x;
            this.playerSprite.y= adjustedToAbsPos.y;
        }
    }
}