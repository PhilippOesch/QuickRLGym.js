import Agent from './Agent';
import FileStrategy from './FileStrategy';

/**
 * Interface for Agents that can be stored and loaded for later usage of interference
 * @abstract
 * @extends Agent
 * @category QuickRLInterface
 */
abstract class PersistableAgent extends Agent {
    /**
     * load the Model
     * @param {FileStrategy} fileManager FileManager Strategy
     * @param {?object} options the options zo use for loading
     * @returns {Promise<void>}
     */
    abstract load(fileManager: FileStrategy, options?: object): Promise<void>;
    /**
     * load the config
     * @param {FileStrategy} fileManager - FileManager Strategy
     * @param {?object} options the options zo use for loading
     * @returns {Promise<void>}
     */
    abstract loadConfig(
        fileManager: FileStrategy,
        options?: object
    ): Promise<void>;
    /**
     * Save the model
     * @param {FileStrategy} fileManager FileManager Strategy
     * @param {?object} options the options to use for saving the agent
     * @returns {Promise<void>}
     */
    abstract save(fileManager: FileStrategy, options?: object): Promise<void>;
    /**
     * Save the Config
     * @param {FileStrategy} fileManager FileManager Strategy
     * @param {?object} options the options to use for saving the agent
     * @returns {Promise<void>}
     */
    abstract saveConfig(
        fileManager: FileStrategy,
        options?: object
    ): Promise<void>;
}

export default PersistableAgent;
