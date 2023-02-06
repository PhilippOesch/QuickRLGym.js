/**
 * Interface To implement platform specific loading and saving mechanics
 */
interface FileStrategy {
    /**
     * Load Function
     * @param options - the options to use for loading
     */
    load(options?: object): Promise<object>;

    /**
     * Save Function
     * @param saveObject - the save Object
     * @param options - the options to use for saving
     */
    save(saveObject: object, options?: object): Promise<boolean>;
}

export default FileStrategy;
