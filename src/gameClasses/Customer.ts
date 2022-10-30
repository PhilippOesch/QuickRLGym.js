import GameObject from "../interfaces/GameObject";
import Vec2 from "./Vec2";
import GameScene from "./GameScene";
import Utils from "../Utils";
import Globals from "../Globals";

export default class Customer extends GameObject {
    private relPosition: Vec2;
    private image: Phaser.GameObjects.Image;
    private destinationIdx: number;

    constructor(scene: GameScene, spawnIdx: number, destIdx: number) {
        super(scene);
        this.relPosition = Globals.destinations[spawnIdx];
        this.destinationIdx = destIdx;
    }

    public get getRelPosition(): Vec2 {
        return this.relPosition;
    }

    public get getDestIdx(): number {
        return this.destinationIdx;
    }

    public preload(): void {
        this.scene.load.image("customer", "assets/customer.png");
    }
    public create(): void {
        const absPosition = Utils.adjustedToAbsPos(this.relPosition);
        this.image = this.scene.add.image(
            absPosition.getX,
            absPosition.getY,
            "customer"
        );
        this.image.setScale(Globals.scale, Globals.scale);
    }

    public setNewPosition(spawnIdx: number, destIdx: number): void {
        this.relPosition = Globals.destinations[spawnIdx];
        this.destinationIdx = destIdx;
        const absPosition = Utils.adjustedToAbsPos(this.relPosition);
        this.image.setPosition(absPosition.getX, absPosition.getY);
        this.image.addToDisplayList();
    }

    public removeCustomer(): void {
        this.image.removeFromDisplayList();
    }
}
