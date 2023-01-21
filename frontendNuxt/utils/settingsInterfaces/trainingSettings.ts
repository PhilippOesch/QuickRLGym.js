import { Setting, SettingNumber } from './general';

export interface TrainingSettings {
    episodes: Setting<SettingNumber>;
    showProgressEvery: Setting<SettingNumber>;
    randomSeed: Setting<SettingNumber>;
}

const defaultTrainingSettings: TrainingSettings = {
    episodes: {
        displayName: 'Episodes',
        setting: new SettingNumber(1, 1),
    },
    showProgressEvery: {
        displayName: 'Simulate Every',
        setting: new SettingNumber(1, 1),
    },
    randomSeed: {
        displayName: 'Random Seed',
        setting: new SettingNumber(1, 1),
    },
};

export default defaultTrainingSettings;
