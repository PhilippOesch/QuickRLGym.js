import { FileStrategies } from 'quickrl.core';
import * as tf from '@tensorflow/tfjs';
import path from 'path';
import { mkdir } from 'fs/promises';

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
 * File Saver for saving tensorflow models in node
 * @category Node
 * @subcategory FileStrategies
 * @implements TFModelSaver
 * @param {TFFSOptions} options save options
 */
export class NodeTFModelSaver<T extends tf.LayersModel>
    implements FileStrategies.TFModelSaver<T>
{
    private options: TFFSOptions;

    constructor(options: TFFSOptions) {
        this.options = options;
    }

    async save(data: T): Promise<boolean> {
        const folderPath = path.dirname(this.options.folderPath);
        await mkdir(folderPath, { recursive: true }).catch(() => {
            console.error('something went wrong');
            return false;
        });

        await data.save('file://' + this.options.folderPath);
        return true;
    }
}

/**
 * File Loader for loading tensorflow models in node
 * @category Node
 * @subcategory FileStrategies
 * @implements TFModelLoader
 * @param {TFFSOptions} options load options
 */
export class NodeTFModelLoader<T extends tf.LayersModel>
    implements FileStrategies.TFModelLoader<T>
{
    private options: TFFSOptions;

    constructor(options: TFFSOptions) {
        this.options = options;
    }

    async load(): Promise<T> {
        const model = await tf.loadLayersModel(
            'file://' + this.options.folderPath + '/model.json'
        );
        return <T>model;
    }
}
