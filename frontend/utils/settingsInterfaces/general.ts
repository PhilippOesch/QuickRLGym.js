// classes instead of interfaces because of type checking
export class SettingNumber {
    max?: number;
    min?: number;
    stepSize: number;

    constructor(stepSize: number, min?: number, max?: number) {
        this.stepSize = stepSize;
        this.min = min;
        this.max = max;
    }
}

export class SettingBoolean {
    defaultValue: boolean;

    constructor(defaultValue: boolean) {
        this.defaultValue = defaultValue;
    }
}

export class SettingArray {
    delimiter: string;

    constructor(delimiter: string) {
        this.delimiter = delimiter;
    }
}

export interface Setting<
    Type extends SettingNumber | SettingBoolean | SettingArray
> {
    displayName: string;
    setting: Type;
}

export interface ISettingTemplate {
    [x: string]: Setting<any>;
}
