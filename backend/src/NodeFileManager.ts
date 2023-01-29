import path from 'path';
import { FileManager } from '../../coreLibary/src';
import { writeFile, readFile, mkdir } from 'fs/promises';

class NodeFileManager implements FileManager {
    public async load(filePath?: string): Promise<object> {
        if (filePath === undefined) {
            throw new Error('No Path was defined.');
        }

        let qtable: Buffer = await readFile(filePath);
        return JSON.parse(qtable.toString());
    }
    public async save(saveObject: object, filePath?: string): Promise<boolean> {
        if (filePath === undefined) {
            throw new Error('No Path was defined.');
        }

        const folderPath = path.dirname(filePath);
        await mkdir(folderPath, { recursive: true }).catch(() => {
            console.error;
            return false;
        });
        await writeFile(filePath, JSON.stringify(saveObject));
        return true;
    }
}

export default NodeFileManager;
