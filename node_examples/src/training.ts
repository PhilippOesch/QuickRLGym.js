import { SingleAgentEnvironment, Agents, QuickRLJS } from 'quickrl.core';
// if you want to improve training performance, make shure you import this dependency
require('@tensorflow/tfjs-node-gpu');

// parameters
const randomSeed = 12;
const numTrainingEpisodes = 10000;
const logEvery = 500;
const maxIterationsPerGame = 25;

// load the environment
const env: SingleAgentEnvironment = QuickRLJS.loadEnv<SingleAgentEnvironment>(
    'BlackJack',
    { randomSeed: randomSeed }
)!;
// create an agent
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
});

// set and initialize the agent for the environment
env.agent = agent;
env.initAgent();

// train the agent
await env.train(numTrainingEpisodes, logEvery, maxIterationsPerGame);
