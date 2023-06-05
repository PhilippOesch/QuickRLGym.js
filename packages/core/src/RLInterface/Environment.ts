import StepResult from './StepResult';

/**
 * Basic Environment Options
 * @category QuickRLInterface
 * @property {?number} randomSeed The random seed
 * @property {?number} penaltyOnUnfinished The penalty reward to return when no end state was reached
 */
export interface EnvOptions {
    randomSeed?: number;
    penaltyOnUnfinished?: number;
}

/**
 * The Environment Interface
 * @abstract
 * @category QuickRLInterface
 */
abstract class Environment {
    /**
     * The state dimension
     * @type {number[]}
     */
    abstract get stateDim(): number[];
    /**
     * The action space
     * @type {string[]}
     */
    abstract get actionSpace(): string[];
    /**
     * The state
     * @type {object}
     */
    abstract get state(): object;
    /**
     * Whether the enviroment state is terminal
     * @type {boolean}
     */
    abstract get isTerminal(): boolean;
    /**
     * The current options
     * @type {EnvOptions | undefined}
     */
    abstract get options(): EnvOptions | undefined;
    /**
     * The current iteration
     * @type {number}
     */
    abstract get iteration(): number;

    /**
     * The current environment stats
     * @type {object}
     */
    abstract get stats(): object;
    /**
     * The enviromnet name
     * @type {string}
     */
    abstract get name(): string;

    /**
     * initialize the environment
     * @param {?EnvOptions} options - the environment options
     * @param {?object} initialState - the optional initial state of the environment
     * @returns {void}
     */
    abstract init(options?: EnvOptions, initialState?: object): void;

    /**
     * take an action in the environment
     * @param {string} action - the action to take
     * @returns {StepResult} the result of the taken action
     */
    abstract step<Taction extends string>(action: Taction): StepResult<object>;

    /**
     * The reset the environment
     * @returns {boolean}
     */
    abstract reset(): boolean;

    /**
     * Set the environment options
     * @param {?EnvOptions} options
     */
    abstract setOptions(options?: EnvOptions): void;

    /**
     * encode the state into an number array
     * @param {object} state the state to encode
     * @returns {number[]} an numbers array
     */
    abstract encodeStateToIndices(state: object): number[];

    /**
     * reset the stats accumulated over the life time of the environment
     * @returns {boolean} True if the reset was sucessfull
     */
    abstract resetStats(): boolean;
}

export default Environment;
