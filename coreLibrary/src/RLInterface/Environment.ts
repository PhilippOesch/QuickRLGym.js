import StepResult from './StepResult';

/**
 * Basic Environment Options
 */
export interface EnvOptions {
    /**
     * The random seed
     */
    randomSeed?: number;
    /**
     * the penalty reward to return when no end state was reached
     */
    penaltyOnUnfinished?: number;
}

/**
 * The Environment Interface
 */
export default abstract class Environment {
    /**
     * The state dimension
     */
    abstract get stateDim(): number[];
    abstract get actionSpace(): string[];
    abstract get state(): object;
    abstract get isTerminal(): boolean;
    abstract get options(): EnvOptions | undefined;
    abstract get iteration(): number;
    abstract get stats(): object;
    abstract get name(): string;

    /**
     * initialize the environment
     * @param options - the environment options
     * @param initialState - the optional initial state of the environment
     */
    abstract init(options?: EnvOptions, initialState?: object): void;

    /**
     * take an action in the environment
     * @param action - the action to take
     * @returns the result of the taken action
     */
    abstract step(action: string): StepResult;

    /**
     * The reset the environment
     */
    abstract reset(): boolean;

    /**
     * Set the environment options
     * @param options
     */
    abstract setOptions(options?: EnvOptions): void;

    /**
     * encode the state into an number array
     * @param state the state to encode
     * @returns an numbers array
     */
    abstract encodeStateToIndices(state: object): number[];

    /**
     * reset the stats accumulated over the life time of the environment
     * @returns True if the reset was sucessfull
     */
    abstract resetStats(): boolean;
}
