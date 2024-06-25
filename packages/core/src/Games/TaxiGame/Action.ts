/**
 * Taxi Actions
 * @enum {number} TaxiAction
 * @category Games
 * @subcategory Taxi
 */
enum TaxiAction {
    Up,
    Down,
    Left,
    Right,
    PickUp,
    DropOff,
}

/**
 * Taxi Action keys.
 * @category Games
 * @subcategory Taxi
 */
export type TaxiActionKey = keyof typeof TaxiAction;

export default TaxiAction;
