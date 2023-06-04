/**
 * Interface To implement platform specific loading and saving mechanics
 * @category QuickRLInterface
 * @param T - type of the save and load object
 */
interface FileStrategy<T> {
    /**
     * Load Function
     * @param {?object} options The options
     * @returns {Promise<T>} a promise for the loaded object
     */
    load(options?: object): Promise<T>;

    /**
     * Save Function
     * @param {?object} options The options
     * @returns {Promise<boolean>} a boolean promise
     */
    save(saveObject: T, options?: object): Promise<boolean>;
}

export default FileStrategy;
