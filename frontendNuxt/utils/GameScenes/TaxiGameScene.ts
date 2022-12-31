import { Scene, GameObjects } from 'phaser';
import { Games, Envs, Vec2 } from 'quickrl.core';

export default class TaxiGameScene extends Scene {
    public static readonly destMapping: string[] = [
        'red',
        'yellow',
        'green',
        'blue',
    ];

    private static carMoveMapping: Map<Games.Taxi.TaxiAction, number[]> =
        new Map([
            [Games.Taxi.TaxiAction.Left, [0, 1]],
            [Games.Taxi.TaxiAction.Right, [2, 3]],
            [Games.Taxi.TaxiAction.Up, [4, 5]],
            [Games.Taxi.TaxiAction.Down, [6, 7]],
        ]);

    private interactiveMode: boolean;
    private taxiGame: Games.Taxi.TaxiGame;

    //visual component
    private playerSprite: GameObjects.Sprite | undefined;
    private customerImage: GameObjects.Image | undefined;
    private uidata: GameObjects.Text | undefined;

    constructor(taxiEnv: Envs.TaxiEnv, interactiveMode: boolean) {
        super('Taxi Game');
        this.interactiveMode = interactiveMode;
        this.taxiGame = taxiEnv.getGame;
    }

    public preload(): void {
        // load tilemap
        this.load.image('tiles', '/gameAssets/taxi/tiles.png');

        // load player
        this.load.spritesheet('taxi', '/gameAssets/taxi/car.png', {
            frameWidth: 90,
            frameHeight: 80,
        });

        // load customer
        this.load.image('customer', '/gameAssets/taxi/customer.png');
    }

    public create(): void {
        // generate Map
        const map = this.make.tilemap({
            data: Games.Taxi.TaxiGameMap.tileMap,
            tileWidth: Games.Taxi.TaxiGlobals.tileWidth,
            tileHeight: Games.Taxi.TaxiGlobals.tileHeight,
        });
        const tiles = map.addTilesetImage('tiles');
        const layer = map.createLayer(0, tiles, 0, 0);
        layer.setScale(
            Games.Taxi.TaxiGlobals.scale,
            Games.Taxi.TaxiGlobals.scale
        );

        // generate Player
        const index: number = this.getSpriteIndex(Games.Taxi.TaxiAction.Left);
        this.playerSprite = this.add.sprite(92, 92, 'taxi', index);
        this.playerSprite.setScale(0.7 * Games.Taxi.TaxiGlobals.scale);
        const absPositionPlayer = Games.Taxi.TaxiUtils.adjustedToAbsPos(
            this.taxiGame.getPlayer.getPosition
        );
        this.playerSprite.setPosition(
            absPositionPlayer.getX,
            absPositionPlayer.getY
        );

        // generate Customer
        const absPositionCustomer = Games.Taxi.TaxiUtils.adjustedToAbsPos(
            this.taxiGame.getCustomer.getPosition
        );
        this.customerImage = this.add.image(
            absPositionCustomer.getX,
            absPositionCustomer.getY,
            'customer'
        );
        this.customerImage.setScale(
            2 * Games.Taxi.TaxiGlobals.scale,
            2 * Games.Taxi.TaxiGlobals.scale
        );

        if (this.interactiveMode) {
            this.setupControlls();
        }
    }

    private updateUIText(): void {
        this.uidata!.setText([
            'Points: ' + this.uidata!.data.get('points'),
            'Iteration: ' + this.uidata!.data.get('iterations'),
            'Destination: ' + this.uidata!.data.get('destination'),
        ]);
    }

    private setupControlls(): void {
        this.input.keyboard.on('keydown-D', () => {
            this.taxiGame.step('Left');
            this.reRender();
        });
        this.input.keyboard.on('keydown-A', () => {
            this.taxiGame.step('Right');
            this.reRender();
        });
        this.input.keyboard.on('keydown-W', () => {
            this.taxiGame.step('Up');
            this.reRender();
        });
        this.input.keyboard.on('keydown-S', () => {
            this.taxiGame.step('Down');
            this.reRender();
        });
        this.input.keyboard.on('keydown-SPACE', () => {
            this.taxiGame.step('PickUp');
            this.reRender();
        });
        this.input.keyboard.on('keydown-X', () => {
            this.taxiGame.step('DropOff');
            this.reRender();
        });
    }

    public reRender(): void {
        // Update Player
        const adjustedToAbsPos: Vec2 = Games.Taxi.TaxiUtils.adjustedToAbsPos(
            this.taxiGame.getPlayer.getPosition
        );
        const index: number = this.getSpriteIndex(
            this.taxiGame.getPlayer.getCarMoveState
        );
        this.playerSprite!.setTexture('taxi', index);

        // for smooth movements
        this.tweens.add({
            targets: this.playerSprite,
            x: adjustedToAbsPos.getX,
            y: adjustedToAbsPos.getY,
            ease: 'Power1',
            duration: 100,
            repeat: 0,
        });

        // Update Customer
        if (this.taxiGame.getCustomer.isCustomerPickedUp) {
            this.customerImage!.removeFromDisplayList();
        }

        const absPositionCustomer = Games.Taxi.TaxiUtils.adjustedToAbsPos(
            this.taxiGame.getCustomer.getPosition
        );
        this.customerImage!.setPosition(
            absPositionCustomer.getX,
            absPositionCustomer.getY
        );

        this.checkIfTerminated();
    }

    private checkIfTerminated(): void {
        if (this.taxiGame.getIsTerminal) {
            if (this.interactiveMode) {
                this.input.keyboard.destroy();
            }
            this.customerImage!.addToDisplayList();
        }
    }

    private getSpriteIndex(carMoveState: Games.Taxi.TaxiAction): number {
        const indexes: number[] =
            TaxiGameScene.carMoveMapping.get(carMoveState)!;
        if (this.taxiGame.getCustomer.isCustomerPickedUp) {
            return indexes[1];
        }
        return indexes[0];
    }
}
