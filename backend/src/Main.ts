import QuickRLJS, { SingleAgentEnvironment, Agents } from 'quickrl.core';
import NodeFileManager from './NodeFileManager';

//parameters
const fileManager = new NodeFileManager();

async function main() {
    //trainTaxiQLAgent();
    //trainTaxiMCAgent();
    //trainBlackJack();
    trainBlackJackMCAgent();
}

async function trainBlackJack() {
    const randomSeed: number = 1234;
    const numIterations: number = 1000000;
    const logEvery: number = 1000;

    const env: SingleAgentEnvironment = QuickRLJS.loadEnv('BlackJack', {
        randomSeed: randomSeed,
    }) as SingleAgentEnvironment;

    console.log(env);
    const agent: Agents.QLAgent = new Agents.QLAgent(env, {
        epsilonStart: 0.1,
        epsilonEnd: 0.1,
        epsilonDecaySteps: 1000,
        learningRate: 0.1,
        discountFactor: 0.6,
    });

    env.setAgent = agent;
    env.initAgent();
    env.train(numIterations, logEvery);
    await agent.save('./models/qTables/blackjack/qTable.json', fileManager);
}

async function trainTaxiQLAgent() {
    const randomSeed: number = 1234;
    const numIterations: number = 100000;
    const logEvery: number = 1000;
    const maxIterationsPerGame: number = 25;

    const env: SingleAgentEnvironment = QuickRLJS.loadEnv('Taxi', {
        randomSeed: randomSeed,
    }) as SingleAgentEnvironment;
    const agent: Agents.QLAgent = new Agents.QLAgent(
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
    env.initAgent();
    env.train(numIterations, logEvery, maxIterationsPerGame);
    await agent.save('./models/qTables/taxi/qTable.json', fileManager);
}

async function trainTaxiMCAgent() {
    const randomSeed: number = 1234;
    const numIterations: number = 100000000;
    const logEvery: number = 10000;
    const maxIterationsPerGame: number = 25;

    const env: SingleAgentEnvironment = QuickRLJS.loadEnv('Taxi', {
        randomSeed: randomSeed,
    }) as SingleAgentEnvironment;

    const agent = new Agents.MCAgent(env, {
        epsilonStart: 0.2,
        discountFactor: 1,
        epsilonDecaySteps: 10000,
    });
    env.setAgent = agent;
    env.initAgent();
    env.train(numIterations, logEvery, maxIterationsPerGame);
    await agent.save('./models/MCAgent/taxi/mcagent.json', fileManager);
}

async function trainBlackJackMCAgent() {
    const randomSeed: number = 1234;
    const numIterations: number = 10000000;
    const logEvery: number = 1000;

    const env: SingleAgentEnvironment = QuickRLJS.loadEnv('BlackJack', {
        randomSeed: randomSeed,
    }) as SingleAgentEnvironment;

    console.log(env);
    const agent = new Agents.MCAgent(env, {
        epsilonStart: 0.2,
        discountFactor: 1,
    });

    env.setAgent = agent;
    env.initAgent();
    env.train(numIterations, logEvery);
    await agent.save('./models/MCAgent/blackjack/mcagent.json', fileManager);
}

main();
