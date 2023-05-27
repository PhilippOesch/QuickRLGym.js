# QuickRLJS-Core

## Usage

QuickRLJS can be used in the frontend as well as in the backend. I recommend training in node.js and then loading and using the model in the frontend.

### Example

First install the npm-package:

```bash
npm install quickrl.core
```

First create "training.ts" or how ever else you choose to call this file:

```ts
import { SingleAgentEnvironment, Agents, QuickRLJS } from 'quickrl.core';
// if you want to improve training performance, make shure you import this dependency
require('@tensorflow/tfjs-node-gpu');

// parameters
const randomSeed = 12;
const numTrainingEpisodes = 10000;
const logEvery = 500;
const maxIterationsPerGame = 25;

// load the environment
const env: SingleAgentEnvironment = <SingleAgentEnvironment>(
    QuickRLJS.loadEnv('BlackJack', { randomSeed: randomSeed })
);

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

```

## Links

- [To the API Documentation](https://philippoesch.github.io/QuickRLGym.js/docs/)