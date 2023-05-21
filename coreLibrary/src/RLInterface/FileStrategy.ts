/**
 * Interface To implement platform specific loading and saving mechanics
 */
interface FileStrategy {
    /**
     * Load Function
     * @returns {Promise<object>} a promise for the loaded object
     */
    load(options?: object): Promise<object>;

    /**
     * Save Function
     * @returns {Promise<object>} a boolean promise
     */
    save(saveObject: object, options?: object): Promise<boolean>;
}

export default FileStrategy;
