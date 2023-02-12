import StepResult from './StepResult';

/**
 * Basic Environment Options
 */
export interface EnvOptions {
    randomSeed?: number;
    penaltyOnUnfinished?: number;
}

/**
 * The Environment Interface
 */
export default abstract class Environment {
    abstract get stateDim(): number[];
    abstract get actionSpace(): string[];
    abstract get state(): object;
    abstract get isTerminal(): boolean;
    abstract get options(): EnvOptions | undefined;
    abstract get iteration(): number;
    abstract get stats(): object;
    abstract get name(): string;
    abstract init(options?: EnvOptions, initialState?: object): void;
    abstract step(action: string): StepResult;
    abstract reset(): boolean;
    abstract setOptions(options?: EnvOptions): void;
    abstract encodeStateToIndices(state: object): number[];
    abstract resetStats(): boolean;
}
