import { FileManager } from 'quickrl.core';
import { saveAs } from 'file-saver';

export default class BrowserFileManager implements FileManager {
    private _path?: string = '';
    private _file?: File;

    public set path(savePath: string) {
        this._path = savePath;
    }

    public get path(): string {
        return this._path ? this._path : '';
    }

    public set file(file: File | undefined) {
        this._file = file;
    }

    public get file(): File | undefined {
        return this._file;
    }

    async load(): Promise<object> {
        if (!this._file) {
            return { error: 'file is undefined' };
        }

        var fileReader = new FileReader();
        fileReader.readAsText(this._file);
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

    async save(saveObject: object): Promise<boolean> {
        const blob = new Blob([JSON.stringify(saveObject)], {
            type: 'application/json',
        });
        saveAs(blob, this._path);
        return true;
    }
}
