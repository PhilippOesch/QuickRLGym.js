import Vec2 from '../../Utils/Vec2';
import { TaxiGlobals } from './index';

/**
 * The class of the Customer who has to be droped of
 * @param {number} spawnIdx - The spawn index
 * @param {number} destIdx - The index of the destination the customer has to be droped of to
 * @category Games
 * @subcategory Taxi
 */
class TaxiCustomer {
    private _destinationIdx: number;
    private _spawnDestIdx: number;
    private _isCustomerPickedUp: boolean = false;

    constructor(spawnIdx: number, destIdx: number) {
        this._spawnDestIdx = spawnIdx;
        this._destinationIdx = destIdx;
    }

    /**
     * The position
     * @type {Vec2}
     */
    public get position(): Vec2 {
        return TaxiGlobals.destinations[this._spawnDestIdx];
    }

    /**
     * The destination
     * @type {number}
     */
    public get destIdx(): number {
        return this._destinationIdx;
    }

    /**
     * The Spawn destination
     * @type {number}
     */
    public get spawnDestIdx(): number {
        return this._spawnDestIdx;
    }

    /**
     * Whether the customer ist picked up
     * @type {boolean}
     */
    public get isCustomerPickedUp(): boolean {
        return this._isCustomerPickedUp;
    }

    /**
     * Pick up The customer
     * @returns {void}
     */
    public pickUpCustomer(): void {
        this._isCustomerPickedUp = true;
    }

    /**
     * Drop Of the customer
     * @returns {void}
     */
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

export default TaxiCustomer;
