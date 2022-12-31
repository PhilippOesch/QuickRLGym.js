import { AlgSetting, SettingNumber } from './general';

interface IMCSettings {
    epsilonStart: AlgSetting<SettingNumber>;
    discountFactor: AlgSetting<SettingNumber>;
    epsilonEnd: AlgSetting<SettingNumber>;
    epsilonDecaySteps: AlgSetting<SettingNumber>;
}

export const mcSettingsDefault: IMCSettings = {
    discountFactor: {
        displayName: 'Discount Factor',
        setting: {
            value: 1,
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

export default IMCSettings;
