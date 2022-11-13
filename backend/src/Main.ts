import { TaxiGame } from '../../shared/src/';
import QLAgent from './RLAgents/QLAgent';
import TaxiEnv from './gameEnvs/TaxiEnv';

//parameters
const randomSeed: number = 1234;
const numIterations: number = 100000;
const logEvery: number = 1000;
const maxIterationsPerGame: number = 25;

async function main() {
    const game: TaxiGame = new TaxiGame(randomSeed);
    const env: TaxiEnv = new TaxiEnv(game);
    const agent = new QLAgent(
        game,
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

    await agent.saveQTableToFile('./qTables/qTable.json');
}

main();
