/**
 * Interface To implement platform specific loading and saving mechanics
 */
interface FileManager {
    /**
     * Load Function
     * @param pathString - path to load the file from
     */
    load(filePath?: string): Promise<object>;

    /**
     * Save Function
     * @param pathString - path to save the file to
     * @param saveObject - object to save
     */
    save(saveObject: object, filePath?: string): Promise<boolean>;
}

export default FileManager;
