import Action from "./Action";
import GameMap from "./GameMap";
import Vec2 from "./Vec2";

/**
 * The Player class
 * @property {Map<Action, Vec2>} moveDirMapping - Static mapping of Actions to direction vectors.
 * @property {Action} moveState - Current state of player movement (Makes it easier later to render the car sprite).
 * @property {Vec2} position - Position of the player.
 * @property {TaxiGame} game - reference to the game object
 * @property {boolean} customerPickedUp - is set when the customer was picked up (In the game logic the position of the customer is then ignored)
 */
export default class Player {
    private static moveDirMapping: Map<Action, Vec2> = new Map([
        [Action.Left, new Vec2(-1, 0)],
        [Action.Right, new Vec2(1, 0)],
        [Action.Up, new Vec2(0, -1)],
        [Action.Down, new Vec2(0, 1)],
        [Action.DropOff, new Vec2(0, 0)],
        [Action.PickUp, new Vec2(0, 0)],
    ]);

    private moveState: Action;
    private position: Vec2;

    /**
     * @param {TaxiGame} game - The game reference.
     * @param {Vec2} relPos - The spawn position of the player
     * @param {Action} carMoveState - The current move state (for rendering).
     */
    constructor(relPos: Vec2, carMoveState: Action = Action.Left) {
        this.moveState = carMoveState;
        this.position = relPos;
    }

    public get getPosition(): Vec2 {
        return this.position;
    }

    public get getCarMoveState(): Action {
        return this.moveState;
    }

    public set setPosition(pos: Vec2) {
        this.position = pos;
    }

    /**
     * Collision detection logic for the collision with walls
     * @param {Action} action - The action that was performed
     * @returns {boolean} true if a collision with the wall was detected.
     */
    public detectCollision(action: Action): boolean {
        let adjustedPos: Vec2 = new Vec2(
            1 + this.position.getX * 2,
            1 + this.position.getY
        );
        const moveDir: Vec2 = Player.moveDirMapping.get(action)!.copy();
        adjustedPos.add(moveDir);

        return GameMap.tileMap[adjustedPos.getY][adjustedPos.getX] == 5;
    }
    public updatePosition(action: Action): void {
        if (!this.detectCollision(action)) {
            this.moveState = action;
            const moveDir: Vec2 = Player.moveDirMapping
                .get(this.moveState)!
                .copy();
            this.position.add(moveDir);
        }
    }
}
