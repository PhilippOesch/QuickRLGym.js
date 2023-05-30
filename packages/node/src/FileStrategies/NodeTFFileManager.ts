import { FileStrategy } from 'quickrl.core';
import * as tf from '@tensorflow/tfjs';
import path from 'path';
import { mkdir } from 'fs/promises';

export interface TFFModelLoadResult {
    model: tf.LayersModel;
    weights: tf.Tensor;
}

export interface TFFSOptions {
    folderPath: string;
}

class TFFileStrategy implements FileStrategy {
    async load(options: TFFSOptions): Promise<object> {
        if (options == undefined) {
            throw new Error('The options have to be defined');
        }

        const model = await tf.loadLayersModel(
            'file://' + options.folderPath + '/model.json'
        );
        return model;
    }
    async save(
        saveObject: tf.LayersModel,
        options: TFFSOptions
    ): Promise<boolean> {
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