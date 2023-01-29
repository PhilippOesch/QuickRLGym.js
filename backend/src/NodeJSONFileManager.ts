import path from 'path';
import { FileManager } from '../../coreLibary/src';
import { writeFile, readFile, mkdir } from 'fs/promises';

export interface NodeJSONFMOptions {
    filePath: string;
}

class NodeJSONFileManager implements FileManager {
    public async load(options: NodeJSONFMOptions): Promise<object> {
        let qtable: Buffer = await readFile(options.filePath);
        return JSON.parse(qtable.toString());
    }
    public async save(
        saveObject: object,
        options: NodeJSONFMOptions
    ): Promise<boolean> {
        const folderPath = path.dirname(options.filePath);
        await mkdir(folderPath, { recursive: true }).catch(() => {
            console.error;
            return false;
        });
        await writeFile(options.filePath, JSON.stringify(saveObject));
        return true;
    }
}

export default NodeJSONFileManager;
