import { ISettingTemplate, Setting, SettingNumber } from './general';

export interface TrainingSettingsTemplate extends ISettingTemplate {
    episodes: Setting<SettingNumber>;
    showProgressEvery: Setting<SettingNumber>;
    randomSeed: Setting<SettingNumber>;
}

const defaultTrainingSettings: TrainingSettingsTemplate = {
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
