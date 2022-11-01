import { Scene, GameObjects } from "phaser";
import Action from "../enums/Action";
import Globals from "../Globals";
import Utils from "../Utils";
import GameMap from "./GameMap";
import TaxiGame from "./TaxiGame";
import Vec2 from "./Vec2";

export default class TaxiGameScene extends Scene {
    private static destMapping: string[] = ["red", "yellow", "green", "blue"];

    private static carMoveMapping: Map<Action, number[]> = new Map([
        [Action.Left, [0, 1]],
        [Action.Right, [2, 3]],
        [Action.Up, [4, 5]],
        [Action.Down, [6, 7]],
    ]);

    private interactiveMode: boolean;
    private taxiGame: TaxiGame;

    //visual component
    private playerSprite: GameObjects.Sprite;
    private customerImage: GameObjects.Image;
    private uidata: GameObjects.Text;

    constructor(taxigame: TaxiGame, interactiveMode: boolean) {
        super("Taxi Game");
        this.interactiveMode = interactiveMode;
        this.taxiGame = taxigame;
    }

    public preload(): void {
        // load tilemap
        this.load.image("tiles", "assets/tilemap.png");

        // load player
        this.load.spritesheet("taxi", "assets/car.png", {
            frameWidth: 90,
            frameHeight: 80,
        });

        // load customer
        this.load.image("customer", "assets/customer.png");
    }

    public create() {
        // generate Map
        const map = this.make.tilemap({
            data: GameMap.tileMap,
            tileWidth: Globals.tileWidth,
            tileHeight: Globals.tileHeight,
        });
        const tiles = map.addTilesetImage("tiles");
        const layer = map.createLayer(0, tiles, 0, 0);
        layer.setScale(Globals.scale, Globals.scale);

        // generate Player
        const index: number = this.getSpriteIndex(Action.Left);
        this.playerSprite = this.add.sprite(24, 24, "taxi", index);
        this.playerSprite.setScale(0.2 * Globals.scale);
        const absPositionPlayer = Utils.adjustedToAbsPos(
            this.taxiGame.getPlayer.getPosition
        );
        this.playerSprite.setPosition(
            absPositionPlayer.getX,
            absPositionPlayer.getY
        );

        // generate Customer
        const absPositionCustomer = Utils.adjustedToAbsPos(
            this.taxiGame.getCustomer.getPosition
        );
        this.customerImage = this.add.image(
            absPositionCustomer.getX,
            absPositionCustomer.getY,
            "customer"
        );
        this.customerImage.setScale(Globals.scale, Globals.scale);

        // generate UI
        this.uidata = this.add.text(0, 0, "", {
            font: "20px Courier",
            color: "#00ff00",
        });
        this.uidata.setDataEnabled();
        this.uidata.setScale(1, 1);
        this.uidata.data.set("points", 0);
        this.uidata.data.set("iterations", 0);
        this.uidata.data.set("destination", "none");

        this.uidata.setText([
            "Points: " + this.uidata.data.get("points"),
            "Iteration: " + this.uidata.data.get("iterations"),
            "Destination: " + this.uidata.data.get("destination"),
        ]);

        if (this.interactiveMode) {
            this.setupControlls();
        }
    }

    private updateUIText(): void {
        this.uidata.setText([
            "Points: " + this.uidata.data.get("points"),
            "Iteration: " + this.uidata.data.get("iterations"),
            "Destination: " + this.uidata.data.get("destination"),
        ]);
    }

    private setupControlls(): void {
        this.input.keyboard.on("keydown-D", () => {
            this.taxiGame.step("Left");
            this.reRender();
        });
        this.input.keyboard.on("keydown-A", () => {
            this.taxiGame.step("Right");
            this.reRender();
        });
        this.input.keyboard.on("keydown-W", () => {
            this.taxiGame.step("Up");
            this.reRender();
        });
        this.input.keyboard.on("keydown-S", () => {
            this.taxiGame.step("Down");
            this.reRender();
        });
        this.input.keyboard.on("keydown-SPACE", () => {
            this.taxiGame.step("PickUp");
            this.reRender();
        });
        this.input.keyboard.on("keydown-X", () => {
            this.taxiGame.step("DropOff");
            this.reRender();
        });
    }

    public reRender(): void {
        // Update Player
        const adjustedToAbsPos: Vec2 = Utils.adjustedToAbsPos(
            this.taxiGame.getPlayer.getPosition
        );
        this.playerSprite.x = adjustedToAbsPos.getX;
        this.playerSprite.y = adjustedToAbsPos.getY;
        const index: number = this.getSpriteIndex(
            this.taxiGame.getPlayer.getCarMoveState
        );
        this.playerSprite.setTexture("taxi", index);

        // Update Customer
        if (this.taxiGame.getPlayer.getCustomerPickedUp) {
            this.customerImage.removeFromDisplayList();
        }

        const absPositionCustomer = Utils.adjustedToAbsPos(
            this.taxiGame.getCustomer.getPosition
        );
        this.customerImage.setPosition(
            absPositionCustomer.getX,
            absPositionCustomer.getY
        );

        // Update UI
        this.uidata.data.values.iterations =
            this.taxiGame.getGameStateManager.getIterations;
        this.uidata.data.values.points =
            this.taxiGame.getGameStateManager.getPoints;
        this.uidata.data.values.destination =
            TaxiGameScene.destMapping[this.taxiGame.getCustomer.getDestIdx];
        this.updateUIText();

        this.checkIfTerminated();
    }

    private checkIfTerminated(): void {
        if (this.taxiGame.getGameState.isTerminal) {
            if (this.interactiveMode) {
                this.input.keyboard.destroy();
            }
            this.customerImage.addToDisplayList();
        }
    }

    private getSpriteIndex(carMoveState: Action): number {
        const indexes: number[] =
            TaxiGameScene.carMoveMapping.get(carMoveState)!;
        if (this.taxiGame.getPlayer.getCustomerPickedUp) {
            return indexes[1];
        }
        return indexes[0];
    }
}
