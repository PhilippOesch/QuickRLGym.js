import Action from "./Action";
import Globals from "../Globals";
import TaxiGame from "./TaxiGame";
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
    private game: TaxiGame;
    private customerPickedUp: boolean;

    /**
     * @param {TaxiGame} game - The game reference.
     * @param {Vec2} relPos - The spawn position of the player
     * @param {Action} carMoveState - The current move state (for rendering).
     */
    constructor(
        game: TaxiGame,
        relPos: Vec2,
        carMoveState: Action = Action.Left
    ) {
        this.game = game;
        this.moveState = carMoveState;
        this.position = relPos;
        this.customerPickedUp = false;
    }

    public get getPosition(): Vec2 {
        return this.position;
    }

    public get getCustomerPickedUp(): boolean {
        return this.customerPickedUp;
    }

    public get getCarMoveState(): Action {
        return this.moveState;
    }

    public set setPosition(pos: Vec2) {
        this.position = pos;
    }

    /**
     * Perform an action to progress the game.
     * @param {Action} action - The action to perform.
     */
    public playAction(action: Action): string {
        //this.game.incrementIterations();
        let takenAction = "";
        if (action == Action.DropOff) {
            this.dropOffCustomer();
            takenAction = action.toString();
            return takenAction;
        }
        if (action == Action.PickUp) {
            this.pickUpCustomer();
            takenAction = action.toString();
            return takenAction;
        }
        this.updatePosition(action);
        takenAction = action.toString();
        return takenAction;
    }

    /**
     * Collision detection logic for the collision with walls
     * @param {Action} action - The action that was performed
     * @returns {boolean} true if a collision with the wall was detected.
     */
    private detectCollision(action: Action): boolean {
        let adjustedPos: Vec2 = new Vec2(
            1 + this.position.getX * 2,
            1 + this.position.getY
        );
        const moveDir: Vec2 = Player.moveDirMapping.get(action)!.copy();
        adjustedPos.add(moveDir);

        return GameMap.tileMap[adjustedPos.getY][adjustedPos.getX] == 5;
    }

    /**
     * perform the pick up action to pick up the customer.
     * When the action was not legal, the player is penalised.
     */
    public pickUpCustomer(): void {
        if (
            !this.customerPickedUp &&
            this.position.isEqual(this.game.getCustomer.getPosition)
        ) {
            this.customerPickedUp = true;
            this.game.updatePoints(Globals.stepPenaltyPoints);
        } else {
            this.game.updatePoints(Globals.illegalMovePoints);
        }
        return;
    }

    public dropOffCustomer(): void {
        if (
            this.position.isEqual(
                Globals.destinations[this.game.getCustomer.getDestIdx]
            ) &&
            this.customerPickedUp
        ) {
            this.game.updatePoints(Globals.dropOffPassangerPoints);
            this.customerPickedUp = false;
            this.game.terminateGame();
        } else {
            this.game.updatePoints(Globals.illegalMovePoints);
        }
        return;
    }

    public updatePosition(action: Action): Vec2 {
        this.game.updatePoints(Globals.stepPenaltyPoints);
        if (!this.detectCollision(action)) {
            this.moveState = action;
            const moveDir: Vec2 = Player.moveDirMapping
                .get(this.moveState)!
                .copy();
            this.position.add(moveDir);
        }
        //console.log("updatePosition", this.position);
        return this.position;
    }
}
