import Vec2 from "./Vec2";

/**
 * Interface that defines the complete state of the game
 * @property {Vec2} playerPos - Position of the player.
 * @property {Vec2} customerPos - Position of the customer.
 * @property {boolean} isCustomerPickedUp - True if the customer has been picked up by the player.
 * @property {number} iterations - The current iteration of this particular episode.
 * @property {points} points - The amount of points, the player has received.
 * @property {isTerminal} isTerminal - Set when the current game episode has terminated.
 */
export default interface GameState {
    playerPos: Vec2;
    customerPos: Vec2;
    isCustomerPickedUp: boolean;
    iterations: number;
    points: number;
    isTerminal: boolean;
}
