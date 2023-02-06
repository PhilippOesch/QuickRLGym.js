import Agent from './Agent';
import FileStrategy from './FileStrategy';

/**
 * Interface for Agents that can be stored and loaded for later usage of interference
 */
export default abstract class PersistentAgent extends Agent {
    /**
     * load the Model
     * @param fileManager FileManager Strategy
     * @param options the options zo use for loading
     */
    abstract load(fileManager: FileStrategy, options?: object): Promise<void>;
    /**
     * load the config
     * @param fileManager - FileManager Strategy
     * @param options the options zo use for loading
     */
    abstract loadConfig(
        fileManager: FileStrategy,
        options?: object
    ): Promise<void>;
    /**
     * Save the model
     * @param fileManager FileManager Strategy
     * @param options the options to use for saving the agent
     */
    abstract save(fileManager: FileStrategy, options?: object): Promise<void>;
    /**
     * Save the Config
     * @param fileManager FileManager Strategy
     * @param options the options to use for saving the agent
     */
    abstract saveConfig(
        fileManager: FileStrategy,
        options?: object
    ): Promise<void>;
}
