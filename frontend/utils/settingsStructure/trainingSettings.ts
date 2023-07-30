import { TrainingSettingsTemplate, SettingNumber } from '~/types/settings';

const trainingSettings: TrainingSettingsTemplate = {
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

export default trainingSettings;
