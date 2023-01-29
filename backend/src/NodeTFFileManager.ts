import { FileManager } from '../../coreLibary/src';
import * as tf from '@tensorflow/tfjs';
import path from 'path';
import { mkdir } from 'fs/promises';

export interface TFFModelLoadResult {
    model: tf.LayersModel;
    weights: tf.Tensor;
}

class NodeTFFileManager implements FileManager {
    _folderpath: string;

    set folderpath(folderpath: string) {
        this._folderpath = folderpath;
    }

    async load(): Promise<object> {
        const model = await tf.loadLayersModel(
            'file://' + this._folderpath + '/model.json'
        );
        return model;
    }
    async save(saveObject: tf.LayersModel): Promise<boolean> {
        const folderPath = path.dirname(this._folderpath);
        await mkdir(folderPath, { recursive: true }).catch(() => {
            console.error;
            return false;
        });

        await saveObject.save('file://' + this._folderpath);
        return true;
    }
}
export default NodeTFFileManager;
