import { Setting, SettingNumber } from './general';

interface IMCSettings {
    epsilonStart: Setting<SettingNumber>;
    discountFactor: Setting<SettingNumber>;
    epsilonEnd: Setting<SettingNumber>;
    epsilonDecaySteps: Setting<SettingNumber>;
}

export const mcSettingsDefault: IMCSettings = {
    discountFactor: {
        displayName: 'Discount Factor',
        setting: {
            max: 1,
            min: 0,
            stepSize: 0.001,
        },
    },
    epsilonStart: {
        displayName: 'Epsilon Start',
        setting: {
            max: 1,
            min: 0,
            stepSize: 0.01,
        },
    },
    epsilonEnd: {
        displayName: 'Epsilon End',
        setting: {
            max: 1,
            min: 0,
            stepSize: 0.01,
        },
    },
    epsilonDecaySteps: {
        displayName: 'Epsilon Decay Steps',
        setting: {
            min: 0,
            stepSize: 1,
        },
    },
};

export default IMCSettings;
