import StepResult from '../RLInterface/StepResult';

export default interface Environment {
    get getActionSpace(): string[];
    get getState(): object;
    get getIsTerminal(): boolean;
    get getIteration(): number;
    step(action: string): StepResult;
    reset(): boolean;
    encodeStateToIndices(state: object): number[];
}
