/**
 * Taxi Actions
 * @enum {number} TaxiAction
 * @category Games
 * @subcategory Taxi
 *
 */
enum TaxiAction {
    Up,
    Down,
    Left,
    Right,
    PickUp,
    DropOff,
}

export type TaxiActionKey = keyof typeof TaxiAction;

export default TaxiAction;
