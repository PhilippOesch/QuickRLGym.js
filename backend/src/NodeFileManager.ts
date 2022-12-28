import path from 'path';
import { FileManager } from '../../coreLibary/src';
import { writeFile, readFile, mkdir } from 'node:fs/promises';

class NodeFileManager implements FileManager {
    public async load(pathString: string): Promise<object> {
        let qtable: Buffer = await readFile(pathString);
        return JSON.parse(qtable.toString());
    }
    public async save(
        pathString: string,
        saveObject: object
    ): Promise<boolean> {
        const folderPath = path.dirname(pathString);
        await mkdir(folderPath, { recursive: true }).catch(() => {
            console.error;
            return false;
        });
        await writeFile(pathString, JSON.stringify(saveObject));
        return true;
    }
}

export default NodeFileManager;
