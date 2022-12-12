import Vec2 from '../../Utils/Vec2';

/**
 * Interface that defines the complete state of the game
 * @property {Vec2} playerPos - Position of the player.
 * @property {number} destinationIdx - The Index of the Destination
 * @property {number} customerPosIdx - The postition of the customer (either at one of the destination [0-3] or in the taxi[5])
 */
export default interface GameState {
    readonly playerPos: Vec2;
    readonly destinationIdx: number;
    readonly customerPosIdx: number;
}
