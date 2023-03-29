import { Agents } from 'quickrl.core';

export interface ISettingsStore {
    [x: string]: SettingsEntry;
}

export interface SettingsEntry {
    algorithmActive: string;
    settingsActive: boolean;
    gameSettings: object;
    [x: string]: any;
}

export interface GameTrainingSettings {
    episodes: number;
    showProgressEvery: number;
    randomSeed: number;
    [x: string]: any;
}

const qLDefaultSettings: Agents.QLAgentSettings = {
    learningRate: 0.001,
    discountFactor: 0.5,
    epsilonStart: 1,
    epsilonEnd: 0.1,
    epsilonDecaySteps: 100,
};

const mCDefaultSettings: Agents.MCAgentSettings = {
    discountFactor: 0.5,
    epsilonStart: 1,
    epsilonEnd: 0.1,
    epsilonDecaySteps: 100,
};

const dqnDefaultSettings: Agents.DQNAgentSettings = {
    learningRate: 0.00025,
    discountFactor: 0.9,
    nnLayer: [128, 128],
    replayMemorySize: 5000,
    batchSize: 32,
    replayMemoryInitSize: 1000,
    epsilonStart: 1,
    epsilonEnd: 0.01,
    epsilonDecaySteps: 1000,
    activateDoubleDQN: true,
    updateTargetEvery: 2000,
};

const defaultGameSettings: GameTrainingSettings = {
    episodes: 10000,
    showProgressEvery: 1000,
    randomSeed: 1234,
};

export const defaultSettings: ISettingsStore = {
    Taxi: {
        algorithmActive: 'random',
        settingsActive: false,
        QLearning: qLDefaultSettings,
        MCLearning: mCDefaultSettings,
        DQN: dqnDefaultSettings,
        gameSettings: defaultGameSettings,
    },
    BlackJack: {
        algorithmActive: 'random',
        settingsActive: false,
        QLearning: qLDefaultSettings,
        MCLearning: mCDefaultSettings,
        DQN: dqnDefaultSettings,
        gameSettings: defaultGameSettings,
    },
};
