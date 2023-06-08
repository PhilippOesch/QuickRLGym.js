import tf from '@tensorflow/tfjs';

/**
 * The General File Loader Interface.
 * @category QuickRLInterface
 * @param T The type of the object to load.
 */
export interface FileLoader<T> {
    /**
     * Load the object.
     * @returns {Promise<T>} Promise for the object to load.
     */
    load(): Promise<T>;
}

/**
 * The General File Save Interface
 * @category QuickRLInterface
 * @param T The type of the object to save
 */
export interface FileSaver<T> {
    /**
     * Save provided object.
     * @param {T} data The data to save.
     * @returns {Promise<boolean>} promise for the success state of a save.
     */
    save(data: T): Promise<boolean>;
}

/**
 * The load interface for loading in json formated files.
 * @category QuickRLInterface
 * @extends FileLoader
 * @param T The type of the object to load.
 */
export interface JSONLoader<T extends object> extends FileLoader<T> {
    load(): Promise<T>;
}

/**
 * The save interface for saving in json format.
 * @category QuickRLInterface
 * @extends FileSaver
 * @param T The type of the object to load.
 */
export interface JSONSaver<T extends object> extends FileSaver<T> {
    save(data: T): Promise<boolean>;
}

/**
 * The load interface for laoding tensorflow models.
 * @category QuickRLInterface
 * @extends FileLoader
 * @param T The type of tf model object to load.
 */
export interface TFModelLoader<T extends tf.LayersModel> extends FileLoader<T> {
    load(): Promise<T>;
}

/**
 * The load interface for loading tensorflow models.
 * @category QuickRLInterface
 * @extends FileSaver
 * @param T The type of the object to load.
 */
export interface TFModelSaver<T extends tf.LayersModel> extends FileSaver<T> {
    save(data: T): Promise<boolean>;
}
