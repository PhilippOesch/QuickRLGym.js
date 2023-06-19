import { Vec2 } from '@root/Utils';

/**
 * The grid game state.
 * @category Games
 * @subcategory GridWorld
 * @property {Vec2} playerPos The player position.
 * @property {Vec2} goalPos The position of the goal
 */
interface GridWorldState {
    playerPos: Vec2;
    goalPos: Vec2;
}

export default GridWorldState;
