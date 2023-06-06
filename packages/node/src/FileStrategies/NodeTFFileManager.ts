import { FileStrategy } from 'quickrl.core';
import * as tf from '@tensorflow/tfjs';
import path from 'path';
import { mkdir } from 'fs/promises';

/**
 * The Result of loading a model
 * @category Node
 * @subcategory FileStrategies
 * @property {tf.LayersModel} model The model structure
 * @property {tf.Tensor} the weights of the model
 */
export interface TFFModelLoadResult {
    model: tf.LayersModel;
    weights: tf.Tensor;
}

/**
 * Options for tensorflow layers model file strategy
 * @category Node
 * @subcategory FileStrategies
 * @property {string} folderPath The folder path to save the file to or load the file from
 */
export interface TFFSOptions {
    folderPath: string;
}

/**
 * File Strategy for handling tensorflow layers models files in node
 * @category Node
 * @subcategory FileStrategies
 * @implements FileStrategy
 */
class TFFileStrategy<T extends tf.LayersModel> implements FileStrategy<T> {
    async load(options: TFFSOptions): Promise<T> {
        if (options == undefined) {
            throw new Error('The options have to be defined');
        }

        const model = await tf.loadLayersModel(
            'file://' + options.folderPath + '/model.json'
        );
        return <T>model;
    }
    async save(saveObject: T, options: TFFSOptions): Promise<boolean> {
        const folderPath = path.dirname(options.folderPath);
        await mkdir(folderPath, { recursive: true }).catch(() => {
            console.error('something went wrong');
            return false;
        });

        await saveObject.save('file://' + options.folderPath);
        return true;
    }
}
export default TFFileStrategy;
