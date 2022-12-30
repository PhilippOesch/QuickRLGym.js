import Environment from './Environment';

/**
 * The Agent Interface
 * @property env - The Agent has a reference to the environment
 */
export default abstract class Agent {
    protected env: Environment;

    constructor(env: Environment) {
        this.env = env;
    }

    /**
     * initialize the agent
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
     */
    abstract feed(
        prevState: object,
        takenAction: string,
        newState: object,
        payoff: number,
        contextInfo: object
    ): void;

    /**
     * set The configuration of the agent after initailizing
     * @param config - The config object
     * @param randomSeed - The random Seed
     */
    abstract setOptions(config: object, randomSeed?: number): void;

    /**
     * Method to select an action for prediction
     * @param {object} state - The current game state
     * @returns {string} - The action to select next
     */
    abstract evalStep(state: object): string;

    /**
     * Method for logging
     */
    abstract log(): void;
}
