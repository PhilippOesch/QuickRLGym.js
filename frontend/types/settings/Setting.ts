import SettingNumber from './SettingNumber';
import SettingBoolean from './SettingBoolean';
import SettingArray from './SettingArray';

type Setting<T extends SettingNumber | SettingBoolean | SettingArray> = {
    displayName: string;
    setting: T;
};

export default Setting;
