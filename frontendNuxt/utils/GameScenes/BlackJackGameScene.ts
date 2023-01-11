import { GameObjects } from 'phaser';
import { Envs, Games } from 'quickrl.core';
import BlackJackUtils from './BlackJackUtils';
import StaticRenderScene from './StaticRenderScene';

export default class BlackJackGameScene extends StaticRenderScene {
    private interactiveMode: boolean;
    private loopEndless: boolean;

    private blackJackGame: Games.BlackJack.BlackJackGame;
    private lastPlayerCard: GameObjects.Image | undefined;
    private dealerUi: GameObjects.Text | undefined;
    private playerUi: GameObjects.Text | undefined;

    private env: Envs.BlackJackEnv;

    constructor(
        env: Envs.BlackJackEnv,
        interactiveMode: boolean,
        loopEndless: boolean = false
    ) {
        super('Black Jack Game');
        this.blackJackGame = env.game;
        this.interactiveMode = interactiveMode;
        this.loopEndless = loopEndless;
        this.env = env;
    }

    public preload(): void {
        // load card images:
        for (const card of BlackJackUtils.getTotalCardSet()) {
            this.load.image(
                card,
                `/gameAssets/blackJack/Playing Cards/card-${card}.png`
            );
        }

        // load backside of card:
        this.load.image(
            'back',
            '/gameAssets/blackJack/Playing Cards/card-back2.png'
        );
    }
    public create() {
        // dealer shown card
        const showCard: Games.BlackJack.BlackJackCard =
            this.blackJackGame.getDealer.getShownCard;

        // dealer hidden card
        this.add.image(210, 130, 'back');

        this.add.image(100, 130, showCard.toString());

        // player shown card
        const lastCard: Games.BlackJack.BlackJackCard =
            this.blackJackGame.getPlayer.getCurrentCard!;
        this.lastPlayerCard = this.add.image(450, 130, lastCard.toString());

        // dealerUI
        const dealerTitle = this.add.text(20, 20, '', {
            font: '20px Courier',
            color: '#ffffff',
        });
        dealerTitle.setText('Dealer');

        this.dealerUi = this.add.text(200, 24, '', {
            font: '16px Courier',
            color: '#ffff00',
        });
        this.dealerUi.setDataEnabled();
        this.dealerUi.data.set('score', 0);
        this.dealerUi.setText(
            this.dealerUi.data.get('score')
                ? 'Score: ' + this.dealerUi.data.get('score')
                : ''
        );

        const playerTitle = this.add.text(400, 20, '', {
            font: '20px Courier',
            color: '#ffffff',
        });
        playerTitle.setText('Player');

        const hasUsableAce: string = this.mapUsableAce(
            this.blackJackGame.getPlayer.hasUsableAce
        );
        const playerScore = this.blackJackGame.getPlayer.getScore;

        this.playerUi = this.add.text(520, 70, '', {
            font: '14px Courier',
            color: '#ffff00',
        });
        this.playerUi.setDataEnabled();
        this.playerUi.data.set('usableAce', hasUsableAce);
        this.playerUi.data.set('score', playerScore);
        this.playerUi.setText([
            this.playerUi.data.get('score')
                ? 'Score: ' + this.playerUi.data.get('score')
                : '',
            'Has Usable Ace: \n\t' + this.playerUi.data.get('usableAce'),
        ]);
        console.log(hasUsableAce);
    }

    public get gameInfo(): object {
        return {};
    }

    public reRender(): void {
        // update cards:
        const currentCard: Games.BlackJack.BlackJackCard =
            this.blackJackGame.getPlayer.getCurrentCard!;
        this.lastPlayerCard!.setTexture(currentCard.toString());
        const newPlayerScore = this.blackJackGame.getPlayer.getScore;
        const newDealerScore = this.blackJackGame.getDealer.getScore;
        const hasUsableAce: string = this.mapUsableAce(
            this.blackJackGame.getPlayer.hasUsableAce
        );

        this.playerUi!.data.set('score', newPlayerScore);
        this.playerUi!.data.set('usableAce', hasUsableAce);

        if (this.blackJackGame.getPlayer.getStick) {
            this.dealerUi!.data.set('score', newDealerScore);
        } else {
            this.dealerUi!.data.set('score', 0);
        }

        this.dealerUi!.setText(
            this.dealerUi!.data.get('score')
                ? 'Score: ' + this.dealerUi!.data.get('score')
                : ''
        );

        this.playerUi!.setText([
            this.playerUi!.data.get('score')
                ? 'Score: ' + this.playerUi!.data.get('score')
                : '',
            'Has Usable Ace: ' + this.playerUi!.data.get('usableAce'),
        ]);
    }

    private mapUsableAce(hasUsableAce: boolean): string {
        return hasUsableAce ? 'Yes' : 'No';
    }
}
