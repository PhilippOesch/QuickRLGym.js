import SettingNumber from './SettingNumber';
import ISettingTemplate from './ISettingTemplate';
import Setting from './Setting';

interface IQLSettings extends ISettingTemplate {
    learningRate: Setting<SettingNumber>;
    discountFactor: Setting<SettingNumber>;
    epsilonStart: Setting<SettingNumber>;
    epsilonEnd: Setting<SettingNumber>;
    epsilonDecaySteps: Setting<SettingNumber>;
}

export default IQLSettings;
