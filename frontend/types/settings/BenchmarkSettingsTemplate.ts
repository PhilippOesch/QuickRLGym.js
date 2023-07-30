import ISettingTemplate from './ISettingTemplate';
import Setting from './Setting';
import SettingNumber from './SettingNumber';

export interface BenchmarkSettingsTemplate extends ISettingTemplate {
    benchmarkGames: Setting<SettingNumber>;
    simulateGameEvery: Setting<SettingNumber>;
    randomSeed: Setting<SettingNumber>;
}

export default BenchmarkSettingsTemplate;
