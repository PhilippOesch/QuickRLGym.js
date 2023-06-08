import { FileStrategies } from 'quickrl.core';
import { saveAs } from 'file-saver';

/**
 * Option for saving json files over the browser
 * @category Web
 * @subcategory FileStrategies
 * @property {string} fileName name of the file to save
 */
export interface WebJSONSaveOptions {
    fileName: string;
}

/**
 * Option for loading json files over the browser
 * @category Web
 * @subcategory FileStrategies
 * @property {File} file file to load
 */
export interface WebJSONLoadOptions {
    file: File;
}

/**
 * File Loader for loading json files over the browser
 * @category Web
 * @subcategory FileStrategies
 * @implements JSONLoader
 * @param {WebJSONLoadOptions} options the load options
 */
export class WebJSONFileLoader<T extends object>
    implements FileStrategies.JSONLoader<T>
{
    private options: WebJSONLoadOptions;

    constructor(options: WebJSONLoadOptions) {
        this.options = options;
    }

    async load(): Promise<T> {
        const fileReader = new FileReader();
        fileReader.readAsText(this.options.file);
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
}

/**
 * File Saver for saving json files over the browser
 * @category Web
 * @subcategory FileStrategies
 * @implements JSONSaver
 * @param {WebJSONSaveOptions} options the save options
 */
export class WebJSONFileSaver<T extends object>
    implements FileStrategies.JSONSaver<T>
{
    private options: WebJSONSaveOptions;

    constructor(options: WebJSONSaveOptions) {
        this.options = options;
    }

    async save(data: T): Promise<boolean> {
        const blob = new Blob([JSON.stringify(data)], {
            type: 'application/json',
        });
        saveAs(blob, this.options.fileName);
        return true;
    }
}
