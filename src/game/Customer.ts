import Vec2 from "./Vec2";
import Globals from "../Globals";

/**
 * The class of the Customer who has to be droped of
 * @property {Vec2} position - the current position of the customer
 * @property {number} destinationIdx - the index of the destination the customer has to be droped of to
 */
export default class Customer {
    private position: Vec2;
    private destinationIdx: number;

    /**
     * @constructor
     * @param {number} spawnIdx - the index of the spawn destination
     * @param {number} destIdx - the indes of the drop off destination
     */
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

    /**
     * Define the spawn destination and the destination the customer has to be droped of to.
     * @param {number} spawnIdx - the index of the spawn destination
     * @param {number} destIdx - the indes of the drop off destination
     */
    public setNewPosition(spawnIdx: number, destIdx: number): void {
        this.position = Globals.destinations[spawnIdx];
        this.destinationIdx = destIdx;
    }
}
