import TaxiGame from "../shared/game/TaxiGame";
import Vec2 from "../shared/game/Vec2";
import QLAgent from "./RLAgents/QLAgent";
import TaxiEnv from "./rlInterface/TaxiEnv";

async function main() {
    const randomSeed: number = 1234;
    const game: TaxiGame = new TaxiGame();
    const numIterations: number = 10000;
    const logEvery: number = 1000;
    const agent = new QLAgent(
        {
            gameStateDim: [5, 5, 4, 5],
            epsilonStart: 0.1,
            epsilonEnd: 0.1,
            epsilonDecaySteps: 1000,
            learningRate: 0.0001,
            discountFactor: 0.6,
            episodes: numIterations,
        },
        TaxiGame.getActionSpace
    );
    const env: TaxiEnv = new TaxiEnv(game, agent, {
        playerPos: new Vec2(3, 2),
        destinationIdx: 2,
        customerPosIdx: 0,
    });
    env.initGame();
    await env.train(numIterations, logEvery);
    await agent.saveQTableToFile("./qTables/qTable.json");
    let qTable = await agent.loadQTable("./qTables/qTable.json");
    console.log("qtable", qTable);
}

main();
