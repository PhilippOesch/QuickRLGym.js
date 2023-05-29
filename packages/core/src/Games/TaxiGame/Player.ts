import TaxiAction from './Action';
import { TaxiGameMap } from './index';
import Vec2 from '../../Utils/Vec2';

/**
 * The Player class
 * @category Games
 * @subcategory Taxi
 * @param {Vec2} relPos - The relative start position of the player.
 * @param {TaxiAction} carMoveState - The car move state at the start.
 */
class TaxiPlayer {
    private static moveDirMapping: Map<TaxiAction, Vec2> = new Map([
        [TaxiAction.Left, new Vec2(-1, 0)],
        [TaxiAction.Right, new Vec2(1, 0)],
        [TaxiAction.Up, new Vec2(0, -1)],
        [TaxiAction.Down, new Vec2(0, 1)],
        [TaxiAction.DropOff, new Vec2(0, 0)],
        [TaxiAction.PickUp, new Vec2(0, 0)],
    ]);

    private _moveState: TaxiAction;
    private _position: Vec2;

    constructor(relPos: Vec2, carMoveState: TaxiAction = TaxiAction.Left) {
        this._moveState = carMoveState;
        this._position = relPos;
    }

    /**
     * The player position
     * @type {Vec2}
     */
    public get position(): Vec2 {
        return this._position;
    }

    /**
     * The car move state for the visualization
     * @type {Vec2}
     */
    public get carMoveState(): TaxiAction {
        return this._moveState;
    }

    /**
     * Set the position
     * @type {Vec2}
     */
    public set position(pos: Vec2) {
        this._position = pos;
    }

    /**
     * Collision detection logic for the collision with walls
     * @param {TaxiAction} action - The action that was performed
     * @returns {boolean} true if a collision with the wall was detected.
     */
    public detectCollision(action: TaxiAction): boolean {
        let adjustedPos: Vec2 = new Vec2(
            1 + this._position.x * 2,
            1 + this._position.y
        );
        const moveDir: Vec2 = TaxiPlayer.moveDirMapping.get(action)!.copy();
        adjustedPos.add(moveDir);

        return TaxiGameMap.wallTiles.has(
            TaxiGameMap.tileMap[adjustedPos.y][adjustedPos.x]
        );
    }

    /**
     * Update the player position according to the taken action
     * @param {TaxiAction} action the action taken
     * @returns {void}
     */
    public updatePosition(action: TaxiAction): void {
        if (!this.detectCollision(action)) {
            this._moveState = action;
            const moveDir: Vec2 = TaxiPlayer.moveDirMapping
                .get(this._moveState)!
                .copy();
            this._position.add(moveDir);
        }
    }
}

export default TaxiPlayer;
