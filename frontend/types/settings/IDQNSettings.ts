import SettingNumber from './SettingNumber';
import ISettingTemplate from './ISettingTemplate';
import Setting from './Setting';
import SettingArray from './SettingArray';
import SettingBoolean from './SettingBoolean';

interface IDQNSettings extends ISettingTemplate {
    learningRate: Setting<SettingNumber>;
    discountFactor: Setting<SettingNumber>;
    nnLayer: Setting<SettingArray>;
    replayMemorySize: Setting<SettingNumber>;
    batchSize: Setting<SettingNumber>;
    replayMemoryInitSize: Setting<SettingNumber>;
    epsilonStart: Setting<SettingNumber>;
    epsilonEnd: Setting<SettingNumber>;
    epsilonDecaySteps: Setting<SettingNumber>;
    activateDoubleDQN: Setting<SettingBoolean>;
    updateTargetEvery: Setting<SettingNumber>;
    kernelInitializerSeed: Setting<SettingNumber>;
}

export default IDQNSettings;
