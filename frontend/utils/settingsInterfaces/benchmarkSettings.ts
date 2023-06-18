import { ISettingTemplate, Setting, SettingNumber } from './general';

export interface BenchmarkSettingsTemplate extends ISettingTemplate {
    benchmarkGames: Setting<SettingNumber>;
    simulateGameEvery: Setting<SettingNumber>;
    randomSeed: Setting<SettingNumber>;
}

const defaultBenchmarkSettings: BenchmarkSettingsTemplate = {
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

export default defaultBenchmarkSettings;
