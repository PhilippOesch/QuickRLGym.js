import TaxiGame from "../../shared/game/TaxiGame";
//import Globals from "../../shared/Globals";
import TaxiGameScene from "./TaxiGameScene";
import QLAgentBrowser from "./Agents/QLAgentBrowser";
import ShowTaxiGameEnv from "./ShowAgentEnv";

async function main() {
    const game: TaxiGame = new TaxiGame(16);
    const agent: QLAgentBrowser = new QLAgentBrowser(
        "/models/qTable.json",
        TaxiGame.getActionSpace
    );
    const gameScene: TaxiGameScene = new TaxiGameScene(game, false, true);
    const env: ShowTaxiGameEnv = new ShowTaxiGameEnv(agent, game, gameScene);
    await env.init();
    env.startGame(true);
    // game.initGame();
    // const gameScene: GameScene = new GameScene(game, true, true);
    // const config: Phaser.Types.Core.GameConfig = {
    //     type: Phaser.AUTO,
    //     parent: "app",
    //     width: Globals.tileWidth * 11 * Globals.scale,
    //     height: Globals.tileHeight * 7 * Globals.scale,
    //     zoom: 1,
    //     physics: {
    //         default: "arcade",
    //         arcade: {
    //             gravity: {
    //                 y: 0,
    //             },
    //         },
    //     },
    //     scene: gameScene,
    // };
    // new Phaser.Game(config);
    // const agent = new QLAgentBrowser(
    //     "/qTables/qTable.json",
    //     TaxiGame.getActionSpace
    // );
    // agent.load();
}

main();
