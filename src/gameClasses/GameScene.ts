import TaxiGame from "./TaxiGame";

export default class GameScene {
    private interactiveMode: boolean;
    private game: TaxiGame;

    constructor(game: TaxiGame, interactiveMode: boolean) {
        this.interactiveMode = this.interactiveMode;
        this.game = game;
    }
}
