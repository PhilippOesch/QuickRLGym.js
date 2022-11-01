import "phaser";
import Action from "../enums/Action";
import Globals from "../Globals";
import TaxiGame from "./TaxiGame";
import GameMap from "./GameMap";
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
    private gameManager: TaxiGame;
    private customerPickedUp: boolean;

    constructor(
        gameManager: TaxiGame,
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

    public get getCustomerPickedUp(): boolean {
        return this.customerPickedUp;
    }

    public playAction(action: Action): void {
        this.gameManager.getGameStateManager.incrementIterations();
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
                this.dropOffCustomer();
                break;
            case Action.PickUp:
                this.pickUpCustomer();
                break;
        }
    }

    private detectCollision(curPos: Vec2, action: Action): boolean {
        let adjustedPos: Vec2 = new Vec2(1 + curPos.getX * 2, 1 + curPos.getY);
        const moveDir: Vec2 = Player.moveDirMapping.get(action)!.copy();
        adjustedPos.add(moveDir);

        return GameMap.tileMap[adjustedPos.getY][adjustedPos.getX] == 5;
    }

    public get getCarMoveState(): Action {
        return this.moveState;
    }

    public pickUpCustomer(): void {
        if (
            !this.customerPickedUp &&
            this.position.isEqual(this.gameManager.getCustomer.getPosition)
        ) {
            this.customerPickedUp = true;
            this.gameManager.getGameStateManager.updatePoints(
                Globals.stepPenaltyPoints
            );
        } else {
            this.gameManager.getGameStateManager.updatePoints(
                Globals.illegalMovePoints
            );
        }
    }

    public dropOffCustomer(): void {
        if (
            this.position.isEqual(
                Globals.destinations[this.gameManager.getCustomer.getDestIdx]
            ) &&
            this.customerPickedUp
        ) {
            this.gameManager.getGameStateManager.updatePoints(
                Globals.dropOffPassangerPoints
            );
            this.customerPickedUp = false;
            this.gameManager.getGameStateManager.terminateGame();
        } else {
            this.gameManager.getGameStateManager.updatePoints(
                Globals.illegalMovePoints
            );
        }
    }

    public updatePosition(action: Action): void {
        this.gameManager.getGameStateManager.updatePoints(
            Globals.stepPenaltyPoints
        );
        if (!this.detectCollision(this.position, action)) {
            this.moveState = action;
            const moveDir: Vec2 = Player.moveDirMapping
                .get(this.moveState)!
                .copy();
            this.position.add(moveDir);
        }
    }
}
