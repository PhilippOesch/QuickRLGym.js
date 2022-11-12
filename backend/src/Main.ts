import { TaxiGame } from "../../shared/src/";
import { Vec2 } from "../../shared/src/";
import QLAgent from "./RLAgents/QLAgent";
import TaxiEnv from "./rlInterface/TaxiEnv";

async function main() {
    const randomSeed: number = 1234;
    const game: TaxiGame = new TaxiGame(randomSeed);
    const numIterations: number = 10000;
    const logEvery: number = 1000;
    const maxIterationsPerGame: number = 25;
    const env: TaxiEnv = new TaxiEnv(game, {
        playerPos: new Vec2(3, 2),
        destinationIdx: 2,
        customerPosIdx: 0,
    });
    const agent = new QLAgent(
        env,
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
    env.setAgent = agent;
    env.initGame();
    env.train(numIterations, logEvery, maxIterationsPerGame);
    await agent.saveQTableToFile("./qTables/qTable.json");
    let qTable = await agent.loadQTable("./qTables/qTable.json");
    console.log("qtable", qTable);
}

main();
