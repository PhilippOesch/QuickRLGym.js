import GameObject from "../interfaces/GameObject";
import Vec2 from "../interfaces/Vec2";
import GameScene from "./GameScene";

export default class Customer extends GameObject{
    private relPos: Vec2;

    constructor(scene: GameScene, relPos: Vec2){
        super(scene);
        this.relPos= relPos;
    }

    public preload(): void {
        throw new Error("Method not implemented.");
    }
    public create(): void {
        throw new Error("Method not implemented.");
    }

}