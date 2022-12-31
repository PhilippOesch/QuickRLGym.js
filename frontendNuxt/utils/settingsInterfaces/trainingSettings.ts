import { Setting, SettingNumber } from './general';

export interface TrainingSettings {
    episodes: Setting<SettingNumber>;
    showProgressEvery: Setting<SettingNumber>;
    randomSeed: Setting<SettingNumber>;
}

const defaultTrainingSettings: TrainingSettings = {
    episodes: {
        displayName: 'Episodes',
        setting: {
            min: 1,
            stepSize: 1,
        },
    },
    showProgressEvery: {
        displayName: 'Simulate Every',
        setting: {
            min: 1,
            stepSize: 1,
        },
    },
    randomSeed: {
        displayName: 'Random Seed',
        setting: {
            min: 1,
            stepSize: 1,
        },
    },
};

export default defaultTrainingSettings;
