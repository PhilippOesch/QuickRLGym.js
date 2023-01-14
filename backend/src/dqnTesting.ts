import {
    Agents,
    SingleAgentEnvironment,
    QuickRLJS,
} from '../../coreLibary/src/index';

const randomSeed = 1234;

const env: SingleAgentEnvironment = QuickRLJS.loadEnv('Taxi', {
    randomSeed: randomSeed,
}) as SingleAgentEnvironment;

// export interface DQNAgentSettings {
//     learningRate: number;
//     discountFactor: number;
//     nnLayer: number[];
//     epsilonStart: number;
//     epsilonEnd: number;
//     epsilonDecaySteps: number;
//     hiddenLayerActivation?: string;
// }

const agentConfig = {
    learningRate: 0.001,
    discountFactor: 0.5,
    nnLayer: [64, 64],
    epsilonStart: 1,
    epsilonEnd: 0.1,
    epsilonDecaySteps: 1000,
    hiddenLayerActivation: 'relu',
};

const agent = new Agents.DQNAgent(env, agentConfig);
agent.init();
