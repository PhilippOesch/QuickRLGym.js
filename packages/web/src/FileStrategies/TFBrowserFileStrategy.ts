import { FileStrategies } from 'quickrl.core';
import * as tf from '@tensorflow/tfjs';

/**
 * Option for loading tensorflow layers models over the browser
 * @category Web
 * @subcategory FileStrategies
 * @property {File} modelFile files representing the model structure
 * @property {File} weightFile files representing the model weights
 */
export interface WebTFLoadOptions {
    modelFile: File;
    weightFile: File;
}

/**
 * File Saver for saving tensorflow models over the browser.
 * @category Web
 * @subcategory FileStrategies
 * @implements TFModelSaver
 */
export class WebTFModelSaver<T extends tf.LayersModel>
    implements FileStrategies.TFModelSaver<T>
{
    async save(data: T): Promise<boolean> {
        await data.save('downloads://model');
        return true;
    }
}

/**
 * File Loader for loading tensorflow models over the browser.
 * @category Web
 * @subcategory FileStrategies
 * @implements TFModelLoader
 * @param {WebTFLoadOptions} options load options.
 */
export class WebTFModelLoader<T extends tf.LayersModel>
    implements FileStrategies.TFModelLoader<T>
{
    private options: WebTFLoadOptions;

    constructor(options: WebTFLoadOptions) {
        this.options = options;
    }

    async load(): Promise<T> {
        const model = await tf.loadLayersModel(
            tf.io.browserFiles([
                this.options.modelFile,
                this.options.weightFile,
            ])
        );
        return <T>model;
    }
}
