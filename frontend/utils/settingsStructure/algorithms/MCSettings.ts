import { IMCSettings, SettingNumber } from '~/types/settings';

export const mcSettings: IMCSettings = {
    discountFactor: {
        displayName: 'Discount Factor',
        setting: new SettingNumber(0.001, 0, 1),
    },
    epsilonStart: {
        displayName: 'Epsilon Start',
        setting: new SettingNumber(0.01, 0, 1),
    },
    epsilonEnd: {
        displayName: 'Epsilon End',
        setting: new SettingNumber(0.01, 0, 1),
    },
    epsilonDecaySteps: {
        displayName: 'Epsilon Decay Steps',
        setting: new SettingNumber(1, 0),
    },
};

export default mcSettings;
