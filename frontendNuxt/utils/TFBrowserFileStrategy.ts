import { FileStrategy } from 'quickrl.core';
import * as tf from '@tensorflow/tfjs';

export interface TFLoadOptions {
    files: File[];
}

class TFBrowserFileStrategy implements FileStrategy {
    async load(options: TFLoadOptions): Promise<tf.LayersModel> {
        const model = await tf.loadLayersModel(
            tf.io.browserFiles([options.files[0], options.files[1]])
        );
        return model;
    }
    async save(saveObject: tf.LayersModel): Promise<boolean> {
        await saveObject.save('downloads://model');
        return true;
    }
}

export default TFBrowserFileStrategy;
