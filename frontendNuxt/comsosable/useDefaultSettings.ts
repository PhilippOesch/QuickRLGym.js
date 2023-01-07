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
        gameSettings: defaultGameSettings,
    },
    BlackJack: {
        algorithmActive: 'random',
        settingsActive: false,
        QLearning: qLDefaultSettings,
        MCLearning: mCDefaultSettings,
        gameSettings: defaultGameSettings,
    },
};
