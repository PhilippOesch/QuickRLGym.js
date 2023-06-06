import { FileStrategy } from 'quickrl.core';
import { saveAs } from 'file-saver';

/**
 * Option for saving json files over the browser
 * @category Web
 * @subcategory FileStrategies
 * @property {string} fileName name of the file to save
 */
export interface JSONBrowserSaveOptions {
    fileName: string;
}

/**
 * Option for loading json files over the browser
 * @category Web
 * @subcategory FileStrategies
 * @property {File} file file to load
 */
export interface JSONBrowserLoadOptions {
    file: File;
}

/**
 * File Strategy for loading and saving json files over the browser
 * @category Web
 * @subcategory FileStrategies
 * @implements FileStrategy
 */
class JSONBrowserFileStrategy<T extends object> implements FileStrategy<T> {
    async load(options: JSONBrowserLoadOptions): Promise<T> {
        const fileReader = new FileReader();
        fileReader.readAsText(options.file);
        let res: string = await new Promise<string>((resolve) => {
            let result = '';
            fileReader.onload = (evt: any) => {
                result += evt.target.result;
            };
            fileReader.onloadend = () => {
                resolve(result);
            };
        });
        return JSON.parse(res);
    }

    async save(
        saveObject: T,
        options: JSONBrowserSaveOptions
    ): Promise<boolean> {
        const blob = new Blob([JSON.stringify(saveObject)], {
            type: 'application/json',
        });
        saveAs(blob, options.fileName);
        return true;
    }
}

export default JSONBrowserFileStrategy;
