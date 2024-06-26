//import { SingleAgentEnvironment, Agents, QuickRLJS } from 'quickrl.core';
import { SingleAgentEnvironment, Agents, QuickRLJS } from 'quickrl.core';
import { FileStrategies } from 'quickrl.node';
require('@tensorflow/tfjs-node-gpu');

async function main() {
    trainTaxiQLAgent();
    //trainTaxiMCAgent();
    //trainBlackJack();
    //trainBlackJackMCAgent();
    //trainTaxiDQN();
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

    env.agent = agent;
    env.initAgent();
    await env.train(numIterations, logEvery);
    await agent.save(
        new FileStrategies.NodeJSONFileSaver({
            filePath: './models/qTables/blackjack/qTable.json',
        })
    );
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
    env.agent = agent;
    env.initAgent();
    await env.train(numIterations, logEvery, maxIterationsPerGame);
    await agent.save(
        new FileStrategies.NodeJSONFileSaver({
            filePath: './models/qTables/taxi/qTable.json',
        })
    );
}

async function trainTaxiMCAgent() {
    const randomSeed: number = 1234;
    const numIterations: number = 100000000;
    const logEvery: number = 10000;
    const maxIterationsPerGame: number = 25;

    const env: SingleAgentEnvironment = QuickRLJS.loadEnv('Taxi', {
        randomSeed: randomSeed,
    }) as SingleAgentEnvironment;

    const agent: Agents.MCAgent = new Agents.MCAgent(env, {
        epsilonStart: 0.2,
        discountFactor: 1,
        epsilonDecaySteps: 10000,
    });
    env.agent = agent;
    env.initAgent();
    await env.train(numIterations, logEvery, maxIterationsPerGame);
    await agent.save(
        new FileStrategies.NodeJSONFileSaver({
            filePath: './models/qTables/taxi/qTable.json',
        })
    );
}

async function trainBlackJackMCAgent() {
    const randomSeed: number = 1234;
    const numIterations: number = 10000000;
    const logEvery: number = 1000;

    const env: SingleAgentEnvironment = QuickRLJS.loadEnv('BlackJack', {
        randomSeed: randomSeed,
    }) as SingleAgentEnvironment;

    console.log(env);
    const agent: Agents.MCAgent = new Agents.MCAgent(env, {
        epsilonStart: 0.2,
        discountFactor: 1,
    });

    env.agent = agent;
    env.initAgent();
    env.train(numIterations, logEvery);
    await agent.save(
        new FileStrategies.NodeJSONFileSaver({
            filePath: './models/MCAgent/blackjack/mcagent.json',
        })
    );
}

async function trainTaxiDQN() {
    const randomSeed: number = 12;
    const numEpisodes: number = 10000;
    const logEvery: number = 20;
    const maxIterationsPerGame: number = 100;

    const env: SingleAgentEnvironment = QuickRLJS.loadEnv('Taxi', {
        randomSeed: randomSeed,
        penaltyOnUnfinished: 0,
    }) as SingleAgentEnvironment;
    const agent: Agents.DQNAgent = new Agents.DQNAgent(env, {
        learningRate: 0.0001,
        discountFactor: 0.99,
        nnLayer: [128, 128, 64],
        epsilonStart: 1,
        epsilonEnd: 0.01,
        epsilonDecaySteps: 10000,
        hiddenLayerActivation: 'relu',
        batchSize: 32,
        replayMemorySize: 10000,
        replayMemoryInitSize: 1000,
        activateDoubleDQN: true,
        updateTargetEvery: 10000,
        layerNorm: false,
    });

    env.agent = agent;
    env.initAgent();

    await agent.saveConfig(
        new FileStrategies.NodeJSONFileSaver({
            filePath: './models/DQN/TaxiTest/config.json',
        })
    );
    // await agent.load(tFFileManager);
    // await env.train(numEpisodes, logEvery, maxIterationsPerGame);
    // await agent.save(tFFileManager);
}

main();
