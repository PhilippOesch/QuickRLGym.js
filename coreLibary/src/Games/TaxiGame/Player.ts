import TaxiAction from './Action';
import TaxiGameMap from './GameMap';
import Vec2 from '../../Utils/Vec2';

/**
 * The Player class
 * @static {Map<Action, Vec2>} moveDirMapping - Static mapping of Actions to direction vectors.
 * @property {Action} _moveState - Current state of player movement (Makes it easier later to render the car sprite).
 * @property {Vec2} _position - Position of the player.qodana scan --show-report
 */
export default class TaxiPlayer {
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

    /**
     * create a player object
     * @param relPos - relative position
     * @param carMoveState - the car move state
     */
    constructor(relPos: Vec2, carMoveState: TaxiAction = TaxiAction.Left) {
        this._moveState = carMoveState;
        this._position = relPos;
    }

    public get position(): Vec2 {
        return this._position;
    }

    public get carMoveState(): TaxiAction {
        return this._moveState;
    }

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
            1 + this._position.getX * 2,
            1 + this._position.getY
        );
        const moveDir: Vec2 = TaxiPlayer.moveDirMapping.get(action)!.copy();
        adjustedPos.add(moveDir);

        return TaxiGameMap.wallTiles.has(
            TaxiGameMap.tileMap[adjustedPos.getY][adjustedPos.getX]
        );
    }
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
