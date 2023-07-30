import { Agents, QuickRLJS } from 'quickrl.core';

export interface ISettingsStore {
    [x: string]: SettingsEntry<any, any>;
}

export interface SettingsEntry<T, D> {
    algorithmActive: string;
    settingsActive: boolean;
    gameSettings: T;
    benchmarkSettings: D;
    [x: string]: any;
}

export interface GameTrainingSettings {
    episodes: number;
    showProgressEvery: number;
    randomSeed: number;
    [x: string]: any;
}

export interface GameBenchmarkSettings {
    benchmarkGames: number;
    simulateGameEvery: number;
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
    kernelInitializerSeed: 12,
};

const defaultGameSettings: GameTrainingSettings = {
    episodes: 10000,
    showProgressEvery: 1000,
    randomSeed: 1234,
};

const defaultBenchmarkSettings: GameBenchmarkSettings = {
    benchmarkGames: 1000,
    simulateGameEvery: 100,
    randomSeed: 4321,
};

function buildDefaultSettings(): ISettingsStore {
    let settings: ISettingsStore = {};

    console.log('generated', settings);

    for (let key of QuickRLJS.listEnvs()) {
        settings[key] = {
            algorithmActive: 'random',
            settingsActive: false,
            QLearning: qLDefaultSettings,
            MCLearning: mCDefaultSettings,
            DQN: dqnDefaultSettings,
            gameSettings: defaultGameSettings,
            benchmarkSettings: defaultBenchmarkSettings,
        };
    }

    return settings;
}

export const defaultSettings: ISettingsStore = buildDefaultSettings();
