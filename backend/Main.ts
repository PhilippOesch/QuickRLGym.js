import TaxiGame from "../shared/game/TaxiGame";
import QLAgent from "./RLAgents/QLAgent";
import TaxiEnv from "./rlInterface/TaxiEnv";

async function main() {
    const randomSeed: number = 20;
    const game: TaxiGame = new TaxiGame(randomSeed);
    const numIterations: number = 10000;
    const agent = new QLAgent(
        {
            gameStateDim: [5, 5, 4, 5],
            epsilonStart: 0.1,
            epsilonEnd: 0.1,
            epsilonDecaySteps: 1000,
            learningRate: 0.1,
            discountFactor: 0.6,
            episodes: numIterations,
        },
        TaxiGame.getActionSpace,
        randomSeed
    );
    const env: TaxiEnv = new TaxiEnv(game, agent);
    env.initGame();
    env.train(numIterations);
    console.trace();
    await agent.saveQTableToFile("./qTables/qTable.json");
    let qTable = await agent.loadQTable("./qTables/qTable.json");
    console.log("qtable", qTable);
}

main();
