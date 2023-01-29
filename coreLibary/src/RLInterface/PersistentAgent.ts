import Agent from './Agent';
import FileManager from './FileManager';

/**
 * Interface for Agents that can be stored and loaded for later usage of interference
 */
export default abstract class PersistentAgent extends Agent {
    /**
     * load the Model
     * @param fileManager FileManager Strategy
     * @param path Path to load the model from
     */
    abstract load(fileManager: FileManager): Promise<void>;
    /**
     * load the config
     * @param fileManager FileManager Strategy
     * @param path Path to laod the config from
     */
    abstract loadConfig(fileManager: FileManager): Promise<void>;
    /**
     * Save the model
     * @param fileManager FileManager Strategy
     * @param path Path to save the model to
     */
    abstract save(fileManager: FileManager): Promise<void>;
    /**
     * Save the Config
     * @param fileManager FileManager Strategy
     * @param path Path so save the config to
     */
    abstract saveConfig(fileManager: FileManager): Promise<void>;
}
