import { TFFileManager } from '../../coreLibary/src';
import * as tf from '@tensorflow/tfjs';
import path from 'path';
import { mkdir } from 'fs/promises';

export interface TFFModelLoadResult {
    model: tf.LayersModel;
    weights: tf.Tensor;
}

class NodeTFFileManager implements TFFileManager {
    paths: string[];

    async load(): Promise<object> {
        const model = await tf.loadLayersModel(
            'file://' + this.paths[0] + '/model.json'
        );
        return model;
    }
    async save(saveObject: tf.LayersModel): Promise<boolean> {
        const folderPath = path.dirname(this.paths[0]);
        await mkdir(folderPath, { recursive: true }).catch(() => {
            console.error;
            return false;
        });

        await saveObject.save('file://' + this.paths[0]);
        return true;
    }
}
export default NodeTFFileManager;
