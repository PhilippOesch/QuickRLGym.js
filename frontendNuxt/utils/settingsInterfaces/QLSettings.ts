import { SettingNumber, AlgSetting } from './general';

interface IQLSettings {
    learningRate: AlgSetting<SettingNumber>;
    discountFactor: AlgSetting<SettingNumber>;
    epsilonStart: AlgSetting<SettingNumber>;
    epsilonEnd: AlgSetting<SettingNumber>;
    epsilonDecaySteps: AlgSetting<SettingNumber>;
}

export const qlSettingsDefault: IQLSettings = {
    learningRate: {
        displayName: 'Learning Rate',
        setting: {
            value: 0.001,
            max: 1,
            min: 0,
            stepSize: 0.000001,
        },
    },
    discountFactor: {
        displayName: 'Discount Factor',
        setting: {
            value: 0.5,
            max: 1,
            min: 0,
            stepSize: 0.001,
        },
    },
    epsilonStart: {
        displayName: 'Epsilon Start',
        setting: {
            value: 1,
            max: 1,
            min: 0,
            stepSize: 0.01,
        },
    },
    epsilonEnd: {
        displayName: 'Epsilon End',
        setting: {
            value: 0.1,
            max: 1,
            min: 0,
            stepSize: 0.01,
        },
    },
    epsilonDecaySteps: {
        displayName: 'Epsilon Decay Steps',
        setting: {
            value: 1000,
            min: 0,
            stepSize: 1,
        },
    },
};

export default IQLSettings;
