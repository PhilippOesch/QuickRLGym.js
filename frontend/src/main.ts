import { TaxiGame, Vec2 } from "../../shared/src";
import TaxiGameScene from "./TaxiGameScene";
import QLAgentBrowser from "./Agents/QLAgentBrowser";
import ShowTaxiGameEnv from "./ShowAgentEnv";

async function main() {
    const game: TaxiGame = new TaxiGame(1234);
    const agent: QLAgentBrowser = new QLAgentBrowser(
        game,
        "models/qTable.json",
        TaxiGame.getActionSpace
    );
    const gameScene: TaxiGameScene = new TaxiGameScene(game, false, true);
    const env: ShowTaxiGameEnv = new ShowTaxiGameEnv(agent, game, gameScene);
    await env.init();
    env.startGame(true);
}

main();
