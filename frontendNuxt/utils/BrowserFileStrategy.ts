import { FileStrategy } from 'quickrl.core';
import { saveAs } from 'file-saver';

export interface BrowserSaveOptions {
    fileName: string;
}

export interface BrowserLoadOptions {
    file: File;
}

export default class BrowserFileStrategy implements FileStrategy {
    async load(options: BrowserLoadOptions): Promise<object> {
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
        saveObject: object,
        options: BrowserSaveOptions
    ): Promise<boolean> {
        const blob = new Blob([JSON.stringify(saveObject)], {
            type: 'application/json',
        });
        saveAs(blob, options.fileName);
        return true;
    }
}
