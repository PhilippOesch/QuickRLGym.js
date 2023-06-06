import path from 'path';
import { FileStrategy } from 'quickrl.core';
import { writeFile, readFile, mkdir } from 'fs/promises';

/**
 * Options for Json File Strategy
 * @category Node
 * @subcategory FileStrategies
 * @property {string} filePath The path to the file
 */
export interface JSONFSOptions {
    filePath: string;
}

/**
 * File Strategy for handling json files in node
 * @category Node
 * @subcategory FileStrategies
 * @implements FileStrategy
 */
class JSONFileStrategy<T extends object> implements FileStrategy<T> {
    public async load(options: JSONFSOptions): Promise<T> {
        let qtable: Buffer = await readFile(options.filePath);
        return JSON.parse(qtable.toString());
    }
    public async save(saveObject: T, options: JSONFSOptions): Promise<boolean> {
        const folderPath = path.dirname(options.filePath);
        await mkdir(folderPath, { recursive: true }).catch(() => {
            console.error('something went wrong');
            return false;
        });
        await writeFile(options.filePath, JSON.stringify(saveObject));
        return true;
    }
}

export default JSONFileStrategy;
