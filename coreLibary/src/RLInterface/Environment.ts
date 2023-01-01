import StepResult from './StepResult';

/**
 * Basic Environment Options
 */
export interface EnvOptions {
    randomSeed?: number;
}

/**
 * The Environment Interface
 */
export default abstract class Environment {
    protected options?: EnvOptions;
    protected initialState?: object;

    /**
     * Base Constructor for an Environment
     * @param options - Environment Options
     * @param initialState - The Initial State of the environment
     */
    constructor(options?: EnvOptions, initialState?: object) {
        this.options = options;
        this.initialState = initialState;
    }

    public abstract get gameStateDim(): number[];
    public abstract get actionSpace(): string[];
    public abstract get state(): object;
    public abstract get isTerminal(): boolean;
    public abstract get iteration(): number;
    public abstract get stats(): object;

    /**
     * Performs an action on the environment
     * @param action - The action to perform
     */
    public abstract step(action: string): StepResult;

    /**
     * Reset the Environment
     */
    public abstract reset(): boolean;

    /**
     * Encodes a game state
     * @param state - The state to encode
     */
    public abstract encodeStateToIndices(state: object): number[];
}
