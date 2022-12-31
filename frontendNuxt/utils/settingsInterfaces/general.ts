export interface SettingNumber {
    value: number;
    max?: number;
    min?: number;
    stepSize?: number;
}

export interface AlgSetting<Type extends SettingNumber | boolean> {
    displayName: string;
    setting: Type;
}
