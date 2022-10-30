import "phaser";
import CarMoveState from "../enums/CarMoveState";
import Globals from "../Globals";
import GameObject from "../interfaces/GameObject";
import Vec2 from "./Vec2";
import Utils from "../Utils";
import GameScene from "./GameScene";

export default class Player extends GameObject {
    private static carMoveMapping: Map<CarMoveState, number[]> = new Map([
        [CarMoveState.Left, [0, 1]],
        [CarMoveState.Right, [2, 3]],
        [CarMoveState.Up, [4, 5]],
        [CarMoveState.Down, [6, 7]],
    ]);

    private static moveDirMapping: Map<CarMoveState, Vec2> = new Map([
        [CarMoveState.Left, new Vec2(1, 0)],
        [CarMoveState.Right, new Vec2(-1, 0)],
        [CarMoveState.Up, new Vec2(0, -1)],
        [CarMoveState.Down, new Vec2(0, 1)],
    ]);

    private carMoveState: CarMoveState;
    private relPosition: Vec2;
    private playerSprite: Phaser.GameObjects.Sprite;
    private customerPickedUp: boolean;

    constructor(
        scene: GameScene,
        relPos: Vec2,
        carMoveState: CarMoveState = CarMoveState.Left
    ) {
        super(scene);
        this.carMoveState = carMoveState;
        this.relPosition = relPos;
        this.customerPickedUp = false;
    }
    public preload(): void {
        this.scene.load.spritesheet("taxi", "assets/car.png", {
            frameWidth: 90,
            frameHeight: 80,
        });
    }
    public create(): void {
        const index: number = this.getSpriteIndex(this.carMoveState);
        this.playerSprite = this.scene.add.sprite(24, 24, "taxi", index);
        this.playerSprite.setScale(0.2 * Globals.scale);
        const absPosition = Utils.adjustedToAbsPos(this.relPosition);
        this.playerSprite.setPosition(absPosition.getX, absPosition.getY);
        this.setupMovement();
    }

    public get getRelPosition(): Vec2 {
        return this.relPosition;
    }

    private updateSprite(carMoveState: CarMoveState): void {
        const index: number = this.getSpriteIndex(carMoveState);
        this.playerSprite.setTexture("taxi", index);
    }

    private getSpriteIndex(carMoveState: CarMoveState): number {
        const indexes: number[] = Player.carMoveMapping.get(carMoveState)!;
        if (this.customerPickedUp) {
            return indexes[1];
        }
        return indexes[0];
    }

    private setupMovement(): void {
        this.scene.input.keyboard.on("keydown-D", () => {
            this.scene.getGameState.incrementIterations();
            let newPosition: Vec2 = Utils.adjustedToAbsPos(this.relPosition);
            newPosition.add(new Vec2(Globals.tileWidth * Globals.scale, 0));
            this.updateSprite(CarMoveState.Left);
            this.updatePosition(newPosition, CarMoveState.Left);
            this.scene.getGameState.updatePoints(-1);
        });
        this.scene.input.keyboard.on("keydown-A", () => {
            this.scene.getGameState.incrementIterations();
            let newPosition: Vec2 = Utils.adjustedToAbsPos(this.relPosition);
            newPosition.add(new Vec2(-Globals.tileWidth * Globals.scale, 0));
            this.updateSprite(CarMoveState.Right);
            this.updatePosition(newPosition, CarMoveState.Right);
            this.scene.getGameState.updatePoints(-1);
        });
        this.scene.input.keyboard.on("keydown-W", () => {
            this.scene.getGameState.incrementIterations();
            let newPosition: Vec2 = Utils.adjustedToAbsPos(this.relPosition);
            newPosition.add(new Vec2(0, -Globals.tileHeight * Globals.scale));
            this.updateSprite(CarMoveState.Up);
            this.updatePosition(newPosition, CarMoveState.Up);
            this.scene.getGameState.updatePoints(-1);
        });
        this.scene.input.keyboard.on("keydown-S", () => {
            this.scene.getGameState.incrementIterations();
            let newPosition: Vec2 = Utils.adjustedToAbsPos(this.relPosition);
            newPosition.add(new Vec2(0, Globals.tileHeight * Globals.scale));
            this.updateSprite(CarMoveState.Down);
            this.updatePosition(newPosition, CarMoveState.Down);
            this.scene.getGameState.updatePoints(-1);
        });
        this.scene.input.keyboard.on("keydown-SPACE", () => {
            this.scene.getGameState.incrementIterations();
            this.pickUpCustomer();
        });
        this.scene.input.keyboard.on("keydown-X", () => {
            this.scene.getGameState.incrementIterations();
            this.dropOffCustomer();
        });
    }

    private detectCollision(newPos: Vec2): boolean {
        const tile: Phaser.Tilemaps.Tile =
            this.scene.getGameMap.getLayer.getTileAtWorldXY(
                newPos.getX,
                newPos.getY
            );
        return tile.index == 5;
    }

    private pickUpCustomer(): void {
        if (this.relPosition.isEqual(this.scene.getCustomer.getRelPosition)) {
            this.customerPickedUp = true;
            this.scene.getCustomer.removeCustomer();
            this.updateSprite(this.carMoveState);
        } else {
            this.scene.updatePoints(Globals.illegalMovePoints);
        }
    }

    private dropOffCustomer(): void {
        if (
            this.relPosition.isEqual(
                Globals.destinations[this.scene.getCustomer.getDestIdx]
            ) &&
            this.customerPickedUp
        ) {
            this.scene.updatePoints(Globals.dropOffPassangerPoints);
            this.scene.respawnCustomer();
            this.customerPickedUp = false;
            this.updateSprite(this.carMoveState);
        } else {
            this.scene.updatePoints(Globals.illegalMovePoints);
        }
    }

    public updatePosition(newPos: Vec2, carMoveState: CarMoveState): void {
        if (!this.detectCollision(newPos)) {
            this.carMoveState = carMoveState;
            const moveDir: Vec2 = Player.moveDirMapping.get(this.carMoveState)!;
            this.relPosition.add(new Vec2(moveDir.getX, moveDir.getY));
            const adjustedToAbsPos: Vec2 = Utils.adjustedToAbsPos(
                this.relPosition
            );
            this.playerSprite.x = adjustedToAbsPos.getX;
            this.playerSprite.y = adjustedToAbsPos.getY;
        }
    }
}
