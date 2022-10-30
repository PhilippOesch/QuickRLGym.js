import "phaser";
import Action from "../enums/Action";
import GameManager from "./GameManager";
import Vec2 from "./Vec2";

export default class Player {
    private static moveDirMapping: Map<Action, Vec2> = new Map([
        [Action.Left, new Vec2(1, 0)],
        [Action.Right, new Vec2(-1, 0)],
        [Action.Up, new Vec2(0, -1)],
        [Action.Down, new Vec2(0, 1)],
        [Action.DropOff, new Vec2(0, 0)],
        [Action.PickUp, new Vec2(0, 0)],
    ]);

    private moveState: Action;
    private position: Vec2;
    private gameManager: GameManager;
    private customerPickedUp: boolean;

    constructor(
        gameManager: GameManager,
        relPos: Vec2,
        carMoveState: Action = Action.Left
    ) {
        this.gameManager = gameManager;
        this.moveState = carMoveState;
        this.position = relPos;
        this.customerPickedUp = false;
    }

    public get getPosition(): Vec2 {
        return this.position;
    }

    public playAction(action: Action): void {
        switch (action) {
            case Action.Up:
                this.updatePosition(action);
                break;
            case Action.Down:
                this.updatePosition(action);
                break;
            case Action.Left:
                this.updatePosition(action);
                break;
            case Action.Right:
                this.updatePosition(action);
                break;
            case Action.DropOff:
                break;
            case Action.PickUp:
        }
    }

    private detectCollision(newPos: Vec2): boolean {
        // TODO
        return false;
    }

    private pickUpCustomer(): void {
        // TODO
    }

    private dropOffCustomer(): void {
        // TODO
    }

    public updatePosition(action: Action): void {
        let newPos: Vec2 = this.position.copy();
        newPos.add(Player.moveDirMapping.get(action)!);
        if (!this.detectCollision(newPos)) {
            this.moveState = action;
            const moveDir: Vec2 = Player.moveDirMapping.get(this.moveState)!;
            this.position.add(new Vec2(moveDir.getX, moveDir.getY));
        }
    }
}
