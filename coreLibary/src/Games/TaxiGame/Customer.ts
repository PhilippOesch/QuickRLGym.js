import Vec2 from '../../Utils/Vec2';
import TaxiGlobals from './Globals';

/**
 * The class of the Customer who has to be droped of
 * @property {Vec2} position - The current position of the customer
 * @property {number} destinationIdx - The index of the destination the customer has to be droped of to
 * @property {number} spawnDestIdx - The index of the destination, the customer started on
 */
export default class TaxiCustomer {
    private _destinationIdx: number;
    private _spawnDestIdx: number;
    private _isCustomerPickedUp: boolean = false;

    /**
     * @constructor
     * @param {number} spawnIdx - The index of the spawn destination
     * @param {number} destIdx - The indes of the drop off destination
     */
    constructor(spawnIdx: number, destIdx: number) {
        this._spawnDestIdx = spawnIdx;
        this._destinationIdx = destIdx;
    }

    public get position(): Vec2 {
        return TaxiGlobals.destinations[this._spawnDestIdx];
    }

    public get destIdx(): number {
        return this._destinationIdx;
    }

    public get spawnDestIdx(): number {
        return this._spawnDestIdx;
    }

    public get isCustomerPickedUp(): boolean {
        return this._isCustomerPickedUp;
    }

    public pickUpCustomer(): void {
        this._isCustomerPickedUp = true;
    }

    public dropOffCustomer(): void {
        this._isCustomerPickedUp = false;
    }

    /**
     * Define the spawn destination and the destination the customer has to be droped of to.
     * @param {number} spawnIdx - The index of the spawn destination
     * @param {number} destIdx - The indes of the drop off destination
     */
    public setNewPosition(spawnIdx: number, destIdx: number): void {
        this._spawnDestIdx = spawnIdx;
        this._destinationIdx = destIdx;
        if (spawnIdx === 4) {
            this._isCustomerPickedUp = true;
        } else {
            this._isCustomerPickedUp = false;
        }
    }
}
