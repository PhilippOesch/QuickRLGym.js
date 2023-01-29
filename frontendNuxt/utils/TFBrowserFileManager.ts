import { FileManager } from 'quickrl.core';
import * as tf from '@tensorflow/tfjs';

class TFBrowserFileManager implements FileManager {
    private _files: File[] | undefined = [];

    public set files(files: File[] | undefined) {
        this._files = files;
    }

    async load(): Promise<tf.LayersModel> {
        if (this._files == undefined) {
            throw new Error('files where not defined');
        }

        const model = await tf.loadLayersModel(
            tf.io.browserFiles([this.files![0], this.files![1]])
        );
        return model;
    }
    async save(saveObject: tf.LayersModel): Promise<boolean> {
        await saveObject.save('downloads://model');
        return true;
    }
}

export default TFBrowserFileManager;
