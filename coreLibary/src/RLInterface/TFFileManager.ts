import FileManager from './FileManager';

export default interface TFFileManager {
    paths: string[];
    /**
     * Load Function
     * @param pathString - path to load the file from
     */
    load(): Promise<object>;

    /**
     * Save Function
     * @param pathString - path to save the file to
     * @param saveObject - object to save
     */
    save(saveObject: object): Promise<boolean>;
}
