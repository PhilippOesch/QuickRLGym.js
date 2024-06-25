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

export type BlackJackActionKey = keyof typeof BlackJackAction

export default BlackJackAction;
