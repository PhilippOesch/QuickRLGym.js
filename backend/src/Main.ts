import { QuickRLJS, SingleAgentEnvironment } from '../../shared/src/';
import QLAgent from './Agents/QAgent/QLAgent';

//parameters
const randomSeed: number = 1234;
const numIterations: number = 100000;
const logEvery: number = 1000;
const maxIterationsPerGame: number = 25;

async function main() {
    const env: SingleAgentEnvironment = QuickRLJS.loadEnv('Taxi', {
        randomSeed: randomSeed,
    }) as SingleAgentEnvironment;
    // const env: TaxiEnv = new TaxiEnv({ randomSeed: randomSeed });
    const agent: QLAgent = new QLAgent(
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
        randomSeed
    );
    env.setAgent = agent;
    env.initEnv();
    env.train(numIterations, logEvery, maxIterationsPerGame);
    await agent.saveQTableToFile('./qTables/qTable.json');
}

main();
