/**
 * Interface To implement platform specific loading and saving mechanics
 * @category QuickRLInterface
 */
interface FileStrategy<T> {
    /**
     * Load Function
     * @param {?object} options The options
     * @returns {Promise<object>} a promise for the loaded object
     */
    load(options?: object): Promise<T>;

    /**
     * Save Function
     * @param {object} saveObject The object to save
     * @param {?object} options The options
     * @returns {Promise<object>} a boolean promise
     */
    save(saveObject: T, options?: object): Promise<boolean>;
}

export default FileStrategy;
