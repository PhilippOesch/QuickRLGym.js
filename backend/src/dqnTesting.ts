import { DQNAgentSettings } from '../../coreLibary/src/Agents';
import {
    Agents,
    SingleAgentEnvironment,
    QuickRLJS,
} from '../../coreLibary/src/index';

const randomSeed = 1234;

const env: SingleAgentEnvironment = QuickRLJS.loadEnv('Taxi', {
    randomSeed: randomSeed,
}) as SingleAgentEnvironment;

const agentConfig: DQNAgentSettings = {
    learningRate: 0.001,
    discountFactor: 0.5,
    nnLayer: [64, 64],
    epsilonStart: 1,
    epsilonEnd: 0.1,
    epsilonDecaySteps: 1000,
    hiddenLayerActivation: 'relu',
    batchSize: 32,
    replayMemorySize: 1000,
    replayMemoryInitSize: 100,
};

const agent = new Agents.DQNAgent(env, agentConfig);
agent.init();
agent.evalStep(env.state);
