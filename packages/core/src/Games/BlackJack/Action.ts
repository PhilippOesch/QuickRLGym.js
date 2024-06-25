/**
 * BlackJack actions
 * @enum {number}
 * @category Games
 * @subcategory BlackJack
 */
export enum BlackJackAction {
    Stick,
    Hit,
}

/**
 * BlackJack action key
 * @category Games
 * @subcategory BlackJack
 */
export type BlackJackActionKey = keyof typeof BlackJackAction

export default BlackJackAction;
