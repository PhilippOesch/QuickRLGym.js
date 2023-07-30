import { BenchmarkSettingsTemplate, SettingNumber } from '~/types/settings';

const benchmarkSettings: BenchmarkSettingsTemplate = {
    benchmarkGames: {
        displayName: 'Benchmark Games',
        setting: new SettingNumber(1, 1),
    },
    simulateGameEvery: {
        displayName: 'Simulate Game Environment Every',
        setting: new SettingNumber(1, 1),
    },
    randomSeed: {
        displayName: 'Random Seed',
        setting: new SettingNumber(1, 1),
    },
};

export default benchmarkSettings;
