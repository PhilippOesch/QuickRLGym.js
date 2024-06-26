import {
    IDQNSettings,
    SettingNumber,
    SettingArray,
    SettingBoolean,
} from '~/types/settings';

export const dqnSettings: IDQNSettings = {
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
    kernelInitializerSeed: {
        displayName: 'Kernal Initalization Seed',
        setting: new SettingNumber(1, 0),
    },
};

export default dqnSettings;
