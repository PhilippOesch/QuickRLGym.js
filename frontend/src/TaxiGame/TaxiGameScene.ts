import { Scene, GameObjects } from 'phaser';
import {
    TaxiAction,
    TaxiGlobals,
    TaxiUtils,
    TaxiGameMap,
    TaxiGame,
} from '../../../shared/src/Games/TaxiGame';
import { TaxiEnv } from '../../../shared/src';
import { Vec2 } from '../../../shared/src';

export default class TaxiGameScene extends Scene {
    private static destMapping: string[] = ['red', 'yellow', 'green', 'blue'];

    private static carMoveMapping: Map<TaxiAction, number[]> = new Map([
        [TaxiAction.Left, [0, 1]],
        [TaxiAction.Right, [2, 3]],
        [TaxiAction.Up, [4, 5]],
        [TaxiAction.Down, [6, 7]],
    ]);

    private interactiveMode: boolean;
    private taxiGame: TaxiGame;

    //visual component
    private playerSprite: GameObjects.Sprite;
    private customerImage: GameObjects.Image;
    private uidata: GameObjects.Text;
    private loopEndless: boolean;

    constructor(
        taxiEnv: TaxiEnv,
        interactiveMode: boolean,
        loopEndless: boolean = false
    ) {
        super('Taxi Game');
        this.interactiveMode = interactiveMode;
        this.taxiGame = taxiEnv.getGame;
        this.loopEndless = loopEndless;
    }

    public preload(): void {
        // load tilemap
        this.load.image('tiles', 'assets/taxi/tiles.png');

        // load player
        this.load.spritesheet('taxi', 'assets/taxi/car.png', {
            frameWidth: 90,
            frameHeight: 80,
        });

        // load customer
        this.load.image('customer', 'assets/taxi/customer.png');
    }

    public create(): void {
        // generate Map
        const map = this.make.tilemap({
            data: TaxiGameMap.tileMap,
            tileWidth: TaxiGlobals.tileWidth,
            tileHeight: TaxiGlobals.tileHeight,
        });
        const tiles = map.addTilesetImage('tiles');
        const layer = map.createLayer(0, tiles, 0, 0);
        layer.setScale(TaxiGlobals.scale, TaxiGlobals.scale);

        // generate Player
        const index: number = this.getSpriteIndex(TaxiAction.Left);
        this.playerSprite = this.add.sprite(92, 92, 'taxi', index);
        this.playerSprite.setScale(0.7 * TaxiGlobals.scale);
        const absPositionPlayer = TaxiUtils.adjustedToAbsPos(
            this.taxiGame.getPlayer.getPosition
        );
        this.playerSprite.setPosition(
            absPositionPlayer.getX,
            absPositionPlayer.getY
        );

        // generate Customer
        const absPositionCustomer = TaxiUtils.adjustedToAbsPos(
            this.taxiGame.getCustomer.getPosition
        );
        this.customerImage = this.add.image(
            absPositionCustomer.getX,
            absPositionCustomer.getY,
            'customer'
        );
        this.customerImage.setScale(
            2 * TaxiGlobals.scale,
            2 * TaxiGlobals.scale
        );

        // generate UI
        this.uidata = this.add.text(0, 0, '', {
            font: '20px Courier',
            color: '#00ff00',
        });
        this.uidata.setDataEnabled();
        this.uidata.setScale(1, 1);
        this.uidata.data.set('points', 0);
        this.uidata.data.set('iterations', 0);
        this.uidata.data.set('destination', 'none');

        this.uidata.setText([
            'Points: ' + this.uidata.data.get('points'),
            'Iteration: ' + this.uidata.data.get('iterations'),
            'Destination: ' + this.uidata.data.get('destination'),
        ]);

        if (this.interactiveMode) {
            this.setupControlls();
        }
    }

    private updateUIText(): void {
        this.uidata.setText([
            'Points: ' + this.uidata.data.get('points'),
            'Iteration: ' + this.uidata.data.get('iterations'),
            'Destination: ' + this.uidata.data.get('destination'),
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
        const adjustedToAbsPos: Vec2 = TaxiUtils.adjustedToAbsPos(
            this.taxiGame.getPlayer.getPosition
        );
        const index: number = this.getSpriteIndex(
            this.taxiGame.getPlayer.getCarMoveState
        );
        this.playerSprite.setTexture('taxi', index);

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
            this.customerImage.removeFromDisplayList();
        }

        const absPositionCustomer = TaxiUtils.adjustedToAbsPos(
            this.taxiGame.getCustomer.getPosition
        );
        this.customerImage.setPosition(
            absPositionCustomer.getX,
            absPositionCustomer.getY
        );

        // Update UI
        this.uidata.data.values.iterations = this.taxiGame.getIteration;
        this.uidata.data.values.points = this.taxiGame.getReturn;
        this.uidata.data.values.destination =
            TaxiGameScene.destMapping[this.taxiGame.getCustomer.getDestIdx];
        this.updateUIText();

        this.checkIfTerminated();
    }

    private checkIfTerminated(): void {
        if (this.taxiGame.getIsTerminal) {
            if (this.interactiveMode && !this.loopEndless) {
                this.input.keyboard.destroy();
            }
            this.customerImage.addToDisplayList();
        }
    }

    private getSpriteIndex(carMoveState: TaxiAction): number {
        const indexes: number[] =
            TaxiGameScene.carMoveMapping.get(carMoveState)!;
        if (this.taxiGame.getCustomer.isCustomerPickedUp) {
            return indexes[1];
        }
        return indexes[0];
    }
}
