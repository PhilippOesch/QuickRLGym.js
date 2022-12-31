export interface SettingNumber {
    max?: number;
    min?: number;
    stepSize: number;
}

export interface Setting<Type extends SettingNumber | boolean> {
    displayName: string;
    setting: Type;
}
