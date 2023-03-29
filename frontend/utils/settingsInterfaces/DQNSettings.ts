import {
    Setting,
    SettingNumber,
    SettingBoolean,
    SettingArray,
} from './general';

interface IDQNSettings {
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
}

export const dqnSettingsDefault: IDQNSettings = {
    learningRate: {
        displayName: 'Learning Rate',
        setting: new SettingNumber(0.000001, 0, 0.5),
    },
    discountFactor: {
        displayName: 'Discount Factor',
        setting: new SettingNumber(0.001, 0, 1),
    },
    batchSize: {
        displayName: 'Batch Size',
        setting: new SettingNumber(32, 32, 512),
    },
    epsilonStart: {
        displayName: 'Epsilon Start',
        setting: new SettingNumber(0.001, 0, 1),
    },
    epsilonEnd: {
        displayName: 'Epsilon End',
        setting: new SettingNumber(0.001, 0, 1),
    },
    epsilonDecaySteps: {
        displayName: 'Epsilon Decay Steps',
        setting: new SettingNumber(1, 0),
    },
    nnLayer: {
        displayName: 'MLP-Layer (Delimiter: ",")',
        setting: new SettingArray(','),
    },
    replayMemorySize: {
        displayName: 'Replay Memory Size',
        setting: new SettingNumber(10, 10),
    },
    replayMemoryInitSize: {
        displayName: 'Initialize Training Memory Size',
        setting: new SettingNumber(10, 10),
    },
    activateDoubleDQN: {
        displayName: 'Activate DDQN Mode',
        setting: new SettingBoolean(true),
    },
    updateTargetEvery: {
        displayName: 'Update Target Network every',
        setting: new SettingNumber(10, 10),
    },
};

export default IDQNSettings;
