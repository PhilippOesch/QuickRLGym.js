import Agent from './Agent';
import * as FileStrategies from './FileStrategy';

/**
 * Interface for Agents that can be stored and loaded for later usage of interference
 * @abstract
 * @extends Agent
 * @param Tmodel The type of the model to load
 * @param Tconfig The type of the config to save
 * @category QuickRLInterface
 */
abstract class PersistableAgent<Tmodel, Tconfig extends object> extends Agent {
    /**
     * load the Model
     * @param {FileStrategy} fileManager FileManager Strategy
     * @param {?object} options the options zo use for loading
     * @returns {Promise<void>}
     */
    abstract load(
        fileManager: FileStrategies.FileLoader<Tmodel>
    ): Promise<void>;
    /**
     * load the config
     * @param {FileStrategy} fileManager - FileManager Strategy
     * @param {?object} options the options zo use for loading
     * @returns {Promise<void>}
     */
    abstract loadConfig(
        fileManager: FileStrategies.JSONLoader<Tconfig>
    ): Promise<void>;
    /**
     * Save the model
     * @param {FileStrategy} fileManager FileManager Strategy
     * @param {?object} options the options to use for saving the agent
     * @returns {Promise<void>}
     */
    abstract save(fileManager: FileStrategies.FileSaver<Tmodel>): Promise<void>;
    /**
     * Save the Config
     * @param {FileStrategy} fileManager FileManager Strategy
     * @param {?object} options the options to use for saving the agent
     * @returns {Promise<void>}
     */
    abstract saveConfig(
        fileManager: FileStrategies.JSONSaver<Tconfig>
    ): Promise<void>;
}

export default PersistableAgent;
