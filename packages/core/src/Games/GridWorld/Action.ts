/**
 * Actions of the grid world.
 * @category Games
 * @subcategory GridWorld
 */
enum GridWorldAction {
    Up,
    Down,
    Left,
    Right,
}

export type GridWorldActionKey = keyof typeof GridWorldAction;

export default GridWorldAction;
