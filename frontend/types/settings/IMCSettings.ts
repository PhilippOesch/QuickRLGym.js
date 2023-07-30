import SettingNumber from './SettingNumber';
import ISettingTemplate from './ISettingTemplate';
import Setting from './Setting';

interface IMCSettings extends ISettingTemplate {
    epsilonStart: Setting<SettingNumber>;
    discountFactor: Setting<SettingNumber>;
    epsilonEnd: Setting<SettingNumber>;
    epsilonDecaySteps: Setting<SettingNumber>;
}

export default IMCSettings;
