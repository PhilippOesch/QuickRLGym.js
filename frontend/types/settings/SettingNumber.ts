class SettingNumber {
    max?: number;
    min?: number;
    stepSize: number;

    constructor(stepSize: number, min?: number, max?: number) {
        this.stepSize = stepSize;
        this.min = min;
        this.max = max;
    }
}

export default SettingNumber;
