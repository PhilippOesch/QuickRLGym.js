import path from 'path';
import { FileManager } from '../../coreLibary/src';
import { writeFile, readFile, mkdir } from 'fs/promises';

class NodeJSONFileManager implements FileManager {
    private _filePath: string;

    public set filePath(filePath: string) {
        this._filePath = filePath;
    }

    public async load(): Promise<object> {
        if (this._filePath === undefined) {
            throw new Error('No Path was defined.');
        }

        let qtable: Buffer = await readFile(this._filePath);
        return JSON.parse(qtable.toString());
    }
    public async save(saveObject: object): Promise<boolean> {
        if (this._filePath === undefined) {
            throw new Error('No Path was defined.');
        }

        const folderPath = path.dirname(this._filePath);
        await mkdir(folderPath, { recursive: true }).catch(() => {
            console.error;
            return false;
        });
        await writeFile(this._filePath, JSON.stringify(saveObject));
        return true;
    }
}

export default NodeJSONFileManager;
