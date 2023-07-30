import ISettingTemplate from './ISettingTemplate';
import Setting from './Setting';
import SettingNumber from './SettingNumber';

interface TrainingSettingsTemplate extends ISettingTemplate {
    episodes: Setting<SettingNumber>;
    showProgressEvery: Setting<SettingNumber>;
    randomSeed: Setting<SettingNumber>;
}

export default TrainingSettingsTemplate;
