import path from 'path';
import { FileManager } from '../../coreLibary/src';
import { writeFile, readFile, mkdir } from 'node:fs/promises';

class NodeFileManager implements FileManager {
    private _path: string;

    public set path(savePath: string) {
        this._path = savePath;
    }

    public get path(): string {
        return this._path;
    }

    public async load(): Promise<object> {
        let qtable: Buffer = await readFile(this._path);
        return JSON.parse(qtable.toString());
    }
    public async save(saveObject: object): Promise<boolean> {
        const folderPath = path.dirname(this._path);
        await mkdir(folderPath, { recursive: true }).catch(() => {
            console.error;
            return false;
        });
        await writeFile(this._path, JSON.stringify(saveObject));
        return true;
    }
}

export default NodeFileManager;
