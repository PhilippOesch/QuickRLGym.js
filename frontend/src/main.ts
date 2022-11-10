import TaxiGame from "../../shared/game/TaxiGame";
import TaxiGameScene from "./TaxiGameScene";
import QLAgentBrowser from "./Agents/QLAgentBrowser";
import ShowTaxiGameEnv from "./ShowAgentEnv";
import Vec2 from "../../shared/game/Vec2";

async function main() {
    const game: TaxiGame = new TaxiGame(1234);
    const agent: QLAgentBrowser = new QLAgentBrowser(
        "/models/qTable.json",
        TaxiGame.getActionSpace
    );
    const gameScene: TaxiGameScene = new TaxiGameScene(game, false, true);
    const env: ShowTaxiGameEnv = new ShowTaxiGameEnv(agent, game, gameScene, {
        playerPos: new Vec2(3, 2),
        destinationIdx: 2,
        customerPosIdx: 0,
    });
    await env.init();
    env.startGame(true);
}

main();
