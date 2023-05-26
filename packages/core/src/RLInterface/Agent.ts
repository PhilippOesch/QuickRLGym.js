import Environment from './Environment';

/**
 * The Agent Interface
 * @param {Environment} env The referenct to the environment
 * @category QuickRLInterface
 */
abstract class Agent {
    protected env: Environment;

    constructor(env: Environment) {
        this.env = env;
    }

    /**
     * initialize the agent
     * @returns {void}
     */
    abstract init(): void;

    /**
     * Method for selecting a new action for training
     * @param {object} state - The current game state
     * @returns {string} - The action to select next
     */
    abstract step(state: object): string;

    /**
     * this method feed the new game state and reward back for the agent to update their algorithm
     * @param {object} prevState - The previous game state
     * @param {string} takenAction - The action that was taken.
     * @param {object} newState - The new game state
     * @param {number} payoff - The gained payoff for the agent
     * @param {object} contextInfo - Through this object, additional information can be provided.
     * @returns {Promise<void>}
     */
    abstract feed(
        prevState: object,
        takenAction: string,
        newState: object,
        payoff: number,
        contextInfo: object
    ): Promise<void>;

    /**
     * Set The configuration of the agent after initailizing.
     * @param {?object} config - The config object
     * @param {?number} randomSeed - The random Seed
     * @returns {void}
     */
    abstract setConfig(config?: object, randomSeed?: number): void;

    /**
     * get the configuration of the agent
     * @type {object | undefined}
     */
    abstract get config(): object | undefined;

    /**
     * Method to select an action for prediction
     * @param {object} state - The current game state
     * @returns {string} - The action to select next
     */
    abstract evalStep(state: object): string;

    /**
     * Interface method for loggin while training
     * @returns {void}
     */
    abstract log(): void;
}

export default Agent;
