import { QuickRLJS, SingleAgentEnvironment } from '../../shared/src/';
import QLAgent from './Agents/QAgent/QLAgent';

//parameters

async function main() {
    trainTaxi();
    //trainBlackJack();
}

async function trainBlackJack() {
    const randomSeed: number = 1234;
    const numIterations: number = 1000000;
    const logEvery: number = 1000;

    const env: SingleAgentEnvironment = QuickRLJS.loadEnv('BlackJack', {
        randomSeed: randomSeed,
    }) as SingleAgentEnvironment;

    console.log(env);
    const agent: QLAgent = new QLAgent(env, {
        epsilonStart: 0.1,
        epsilonEnd: 0.1,
        epsilonDecaySteps: 1000,
        learningRate: 0.1,
        discountFactor: 0.6,
    });

    env.setAgent = agent;
    env.initEnv();
    env.train(numIterations, logEvery);
    await agent.saveQTableToFile('./qTables/blackjack/qTable.json');
}

async function trainTaxi() {
    const randomSeed: number = 1234;
    const numIterations: number = 100000;
    const logEvery: number = 1000;
    const maxIterationsPerGame: number = 25;

    const env: SingleAgentEnvironment = QuickRLJS.loadEnv('Taxi', {
        randomSeed: randomSeed,
    }) as SingleAgentEnvironment;
    const agent: QLAgent = new QLAgent(
        env,
        {
            epsilonStart: 0.1,
            epsilonEnd: 0.1,
            epsilonDecaySteps: 1000,
            learningRate: 0.1,
            discountFactor: 0.6,
        },
        randomSeed
    );
    env.setAgent = agent;
    env.initEnv();
    env.train(numIterations, logEvery, maxIterationsPerGame);
    await agent.saveQTableToFile('./qTables/taxi/qTable.json');
}

main();
