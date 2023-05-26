/**
 * Interface To implement platform specific loading and saving mechanics
 * @category QuickRLInterface
 */
interface FileStrategy {
    /**
     * Load Function
     * @param {?object} options The options
     * @returns {Promise<object>} a promise for the loaded object
     */
    load(options?: object): Promise<object>;

    /**
     * Save Function
     * @param {object} saveObject The object to save
     * @param {?object} options The options
     * @returns {Promise<object>} a boolean promise
     */
    save(saveObject: object, options?: object): Promise<boolean>;
}

export default FileStrategy;
