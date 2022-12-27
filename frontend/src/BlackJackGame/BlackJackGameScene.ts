import { GameObjects, Scene } from 'phaser';
import { Envs, Games } from '../../../shared/src';
// import {
//     BlackJackCard,
//     BlackJackGame,
// } from '../../../shared/src/Games/BlackJack';
import BlackJackUtils from './Utils';

export default class BlackJackGameScene extends Scene {
    private interactiveMode: boolean;
    private loopEndless: boolean;

    private blackJackGame: Games.BlackJack.BlackJackGame;
    //private showDealerCard: GameObjects.Image;
    private lastPlayerCard: GameObjects.Image;
    private dealerUi: GameObjects.Text;
    private playerUi: GameObjects.Text;
    private totalScoreUi: GameObjects.Text;

    private totalScore: number = 0;

    constructor(
        env: Envs.BlackJackEnv,
        interactiveMode: boolean,
        loopEndless: boolean = false
    ) {
        super('Black Jack Game');
        this.blackJackGame = env.getGame;
        this.interactiveMode = interactiveMode;
        this.loopEndless = loopEndless;
    }

    public preload(): void {
        // load card images:
        for (const card of BlackJackUtils.getTotalCardSet()) {
            this.load.image(
                card,
                `assets/blackJack/Playing Cards/card-${card}.png`
            );
        }

        // load backside of card:
        this.load.image(
            'back',
            'assets/blackJack/Playing Cards/card-back2.png'
        );
    }
    public create() {
        // dealer shown card
        const showCard: Games.BlackJack.BlackJackCard =
            this.blackJackGame.getDealer.getShownCard;

        // dealer hidden card
        this.add.image(300, 130, 'back');

        this.add.image(150, 130, showCard.toString());

        // player shown card
        const lastCard: Games.BlackJack.BlackJackCard =
            this.blackJackGame.getPlayer.getCurrentCard!;
        this.lastPlayerCard = this.add.image(230, 370, lastCard.toString());

        // dealerUI
        const dealerTitle = this.add.text(20, 20, '', {
            font: '24px Courier',
            color: '#ffffff',
        });
        dealerTitle.setText('Dealer');

        this.dealerUi = this.add.text(250, 26, '', {
            font: '18px Courier',
            color: '#ffffff',
        });
        this.dealerUi.setDataEnabled();
        this.dealerUi.data.set('score', 0);
        this.dealerUi.setText(
            this.dealerUi.data.get('score')
                ? 'Score: ' + this.dealerUi.data.get('score')
                : ''
        );

        const playerTitle = this.add.text(20, 250, '', {
            font: '24px Courier',
            color: '#ffffff',
        });
        playerTitle.setText('Player');

        const playerScore = this.blackJackGame.getPlayer.getScore;
        this.playerUi = this.add.text(250, 250, '', {
            font: '18px Courier',
            color: '#ffffff',
        });
        this.playerUi.setDataEnabled();
        this.playerUi.data.set('score', playerScore);
        this.playerUi.setText(
            this.playerUi.data.get('score')
                ? 'Score: ' + this.playerUi.data.get('score')
                : ''
        );
    }

    public reRender(): void {
        // update cards:
        const currentCard: Games.BlackJack.BlackJackCard =
            this.blackJackGame.getPlayer.getCurrentCard!;
        this.lastPlayerCard.setTexture(currentCard.toString());
        const newPlayerScore = this.blackJackGame.getPlayer.getScore;
        const newDealerScore = this.blackJackGame.getDealer.getScore;

        this.playerUi.data.set('score', newPlayerScore);

        if (this.blackJackGame.getPlayer.getStick) {
            this.dealerUi.data.set('score', newDealerScore);
        } else {
            this.dealerUi.data.set('score', 0);
        }

        this.dealerUi.setText(
            this.dealerUi.data.get('score')
                ? 'Score: ' + this.dealerUi.data.get('score')
                : ''
        );

        this.playerUi.setText(
            this.playerUi.data.get('score')
                ? 'Score: ' + this.playerUi.data.get('score')
                : ''
        );
    }
}
