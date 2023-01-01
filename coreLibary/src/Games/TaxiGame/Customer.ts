import Vec2 from '../../Utils/Vec2';
import TaxiGlobals from './Globals';

/**
 * The class of the Customer who has to be droped of
 * @property {Vec2} position - The current position of the customer
 * @property {number} destinationIdx - The index of the destination the customer has to be droped of to
 * @property {number} spawnDestIdx - The index of the destination, the customer started on
 */
export default class TaxiCustomer {
    private destinationIdx: number;
    private spawnDestIdx: number;
    private customerPickedUp: boolean = false;

    /**
     * @constructor
     * @param {number} spawnIdx - The index of the spawn destination
     * @param {number} destIdx - The indes of the drop off destination
     */
    constructor(spawnIdx: number, destIdx: number) {
        this.spawnDestIdx = spawnIdx;
        this.destinationIdx = destIdx;
    }

    public get getPosition(): Vec2 {
        return TaxiGlobals.destinations[this.spawnDestIdx];
    }

    public get getDestIdx(): number {
        return this.destinationIdx;
    }

    public get getSpawnDestIdx(): number {
        return this.spawnDestIdx;
    }

    public get isCustomerPickedUp(): boolean {
        return this.customerPickedUp;
    }

    public pickUpCustomer(): void {
        this.customerPickedUp = true;
    }

    public dropOffCustomer(): void {
        this.customerPickedUp = false;
    }

    /**
     * Define the spawn destination and the destination the customer has to be droped of to.
     * @param {number} spawnIdx - The index of the spawn destination
     * @param {number} destIdx - The indes of the drop off destination
     */
    public setNewPosition(spawnIdx: number, destIdx: number): void {
        this.spawnDestIdx = spawnIdx;
        this.destinationIdx = destIdx;
        if (spawnIdx === 4) {
            this.customerPickedUp = true;
        } else {
            this.customerPickedUp = false;
        }
    }
}
