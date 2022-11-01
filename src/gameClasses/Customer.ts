import Vec2 from "./Vec2";
import Globals from "../Globals";

export default class Customer {
    private position: Vec2;
    private destinationIdx: number;

    constructor(spawnIdx: number, destIdx: number) {
        this.position = Globals.destinations[spawnIdx];
        this.destinationIdx = destIdx;
    }

    public get getPosition(): Vec2 {
        return this.position;
    }

    public get getDestIdx(): number {
        return this.destinationIdx;
    }

    public setNewPosition(spawnIdx: number, destIdx: number): void {
        this.position = Globals.destinations[spawnIdx];
        this.destinationIdx = destIdx;
    }
}
