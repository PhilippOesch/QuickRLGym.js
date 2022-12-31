//import { MCAgentSettings, QLAgentSettings } from 'quickrl.core/out/Agents';

const qLDefaultSettings: any = {
    learningRate: 0.001,
    discountFactor: 0.5,
    epsilonStart: 1,
    epsilonEnd: 0.1,
    epsilonDecaySteps: 100,
};

const mCDefaultSettings: any = {
    discountFactor: 0.5,
    epsilonStart: 1,
    epsilonEnd: 0.1,
    epsilonDecaySteps: 100,
};

const defaultGameSettings: any = {
    episodes: 10000,
    showProgressEvery: 1000,
    randomSeed: 1234,
};

export const defaultSettings = {
    Taxi: {
        QLearning: qLDefaultSettings,
        MCLearning: mCDefaultSettings,
        gameSettings: defaultGameSettings,
    },
};
