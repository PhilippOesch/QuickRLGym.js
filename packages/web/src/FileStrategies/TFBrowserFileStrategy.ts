import { FileStrategy } from 'quickrl.core';
import * as tf from '@tensorflow/tfjs';

/**
 * Option for loading tensorflow layers models over the browser
 * @category Web
 * @subcategory FileStrategies
 * @property {File[]} files files to load
 */
export interface TFBrowserLoadOptions {
    files: File[];
}

/**
 * File Strategy for loading and saving tensorflow layers models over the browser
 * @category Web
 * @subcategory FileStrategies
 * @implements FileStrategy
 */
class TFBrowserFileStrategy<T extends tf.LayersModel>
    implements FileStrategy<T>
{
    async load(options: TFBrowserLoadOptions): Promise<T> {
        const model = await tf.loadLayersModel(
            tf.io.browserFiles([options.files[0], options.files[1]])
        );
        return <T>model;
    }
    async save(saveObject: T): Promise<boolean> {
        await saveObject.save('downloads://model');
        return true;
    }
}

export default TFBrowserFileStrategy;
