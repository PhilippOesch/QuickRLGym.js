import StepResult from '../RLInterface/StepResult';

export default abstract class Environment {
    protected options?: object;
    protected initialState?: object;

    constructor(options?: object, initialState?: object) {
        this.options = options;
        this.initialState = initialState;
    }
    public abstract get getGameStateDim(): number[];
    public abstract get getActionSpace(): string[];
    public abstract get getState(): object;
    public abstract get getIsTerminal(): boolean;
    public abstract get getIteration(): number;
    public abstract step(action: string): StepResult;
    public abstract reset(): boolean;
    public abstract encodeStateToIndices(state: object): number[];
}
