import FileManager from './FileManager';

export default interface TrainableAgent {
    /**
     * load the Model
     * @param fileManager FileManager Strategy
     * @param path Path to load the model from
     */
    load(fileManager: FileManager, path?: string): Promise<void>;
    /**
     * load the config
     * @param fileManager FileManager Strategy
     * @param path Path to laod the config from
     */
    loadConfig(fileManager: FileManager, path?: string): Promise<void>;
    /**
     * Save the model
     * @param fileManager FileManager Strategy
     * @param path Path to save the model to
     */
    save(fileManager: FileManager, path?: string): Promise<void>;
    /**
     * Save the Config
     * @param fileManager FileManager Strategy
     * @param path Path so save the config to
     */
    saveConfig(fileManager: FileManager, path?: string): Promise<void>;
}
