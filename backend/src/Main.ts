import {
    QuickRLJS,
    SingleAgentEnvironment,
    QLAgent,
    MCAgent,
} from '../../shared/src/';
import NodeFileManager from './NodeFileManager';

//parameters
const fileManager = new NodeFileManager();

async function main() {
    //trainTaxiQLAgent();
    trainTaxiMCAgent();
    //trainBlackJack();
    //trainBlackJackMCAgent();
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
    await agent.save('./qTables/blackjack/qTable.json', fileManager);
}

async function trainTaxiQLAgent() {
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
    await agent.save('./qTables/taxi/qTable.json', fileManager);
}

async function trainTaxiMCAgent() {
    const randomSeed: number = 1234;
    const numIterations: number = 100000000;
    const logEvery: number = 10000;
    const maxIterationsPerGame: number = 25;

    const env: SingleAgentEnvironment = QuickRLJS.loadEnv('Taxi', {
        randomSeed: randomSeed,
    }) as SingleAgentEnvironment;

    const agent = new MCAgent(env, {
        epsilonStart: 1,
        discountFactor: 1,
        epsilonDecaySteps: 10000,
        epsilonEnd: 0.1,
    });
    env.setAgent = agent;
    env.initEnv();
    env.train(numIterations, logEvery, maxIterationsPerGame);
    await agent.save('./MCAgent/taxi/mcagent.json', fileManager);
}

async function trainBlackJackMCAgent() {
    const randomSeed: number = 1234;
    const numIterations: number = 1000000;
    const logEvery: number = 1000;

    const env: SingleAgentEnvironment = QuickRLJS.loadEnv('BlackJack', {
        randomSeed: randomSeed,
    }) as SingleAgentEnvironment;

    console.log(env);
    const agent = new MCAgent(env, {
        epsilonStart: 0.2,
        discountFactor: 1,
    });

    env.setAgent = agent;
    env.initEnv();
    env.train(numIterations, logEvery);
    await agent.save('./MCAgent/blackjack/mcagent.json', fileManager);
}

main();
