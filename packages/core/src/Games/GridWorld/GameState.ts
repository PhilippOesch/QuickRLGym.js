import { Vec2 } from '@root/Utils';

/**
 * The grid game state.
 * @category Games
 * @subcategory GridWorld
 * @property {Vec2} playerPos The player position.
 */
interface GridWorldState {
    playerPos: Vec2;
}

export default GridWorldState;
