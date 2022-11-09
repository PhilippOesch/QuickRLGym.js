import Vec2 from "./Vec2";
import Globals from "../Globals";

/**
 * The class of the Customer who has to be droped of
 * @property {Vec2} position - The current position of the customer
 * @property {number} destinationIdx - The index of the destination the customer has to be droped of to
 * @property {number} spawnDestIdx - The index of the destination, the customer started on
 */
export default class Customer {
    private position: Vec2;
    private destinationIdx: number;
    private spawnDestIdx: number;

    /**
     * @constructor
     * @param {number} spawnIdx - The index of the spawn destination
     * @param {number} destIdx - The indes of the drop off destination
     */
    constructor(spawnIdx: number, destIdx: number) {
        this.spawnDestIdx = spawnIdx;
        this.position = Globals.destinations[spawnIdx];
        this.destinationIdx = destIdx;
    }

    public get getPosition(): Vec2 {
        return this.position;
    }

    public get getDestIdx(): number {
        return this.destinationIdx;
    }

    public get getSpawnDestIdx(): number {
        return this.spawnDestIdx;
    }

    /**
     * Define the spawn destination and the destination the customer has to be droped of to.
     * @param {number} spawnIdx - The index of the spawn destination
     * @param {number} destIdx - The indes of the drop off destination
     */
    public setNewPosition(spawnIdx: number, destIdx: number): void {
        this.spawnDestIdx = spawnIdx;
        this.position = Globals.destinations[spawnIdx];
        this.destinationIdx = destIdx;
    }
}
