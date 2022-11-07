import TaxiGame from "../shared/game/TaxiGame";
import QLAgent from "./RLAgents/QLAgent";
import TaxiEnv from "./rlInterface/TaxiEnv";

async function main() {
    const randomSeed: number = 16;
    const game: TaxiGame = new TaxiGame(randomSeed);
    const numIterations: number = 10000000;
    const agent = new QLAgent(
        {
            gameStateDim: [5, 5, 4, 5],
            epsilonStart: 0.9,
            epsilonEnd: 0.01,
            learningRate: 0.001,
            discountFactor: 0.1,
            episodes: numIterations,
        },
        TaxiGame.getActionSpace,
        randomSeed
    );
    const env: TaxiEnv = new TaxiEnv(game, agent);
    env.initGame();
    env.train(numIterations);
    await agent.saveQTableToFile("./qTables/qTable.json");
    let qTable = await agent.loadQTable("./qTables/qTable.json");
    console.log("qtable", qTable);
}

main();
