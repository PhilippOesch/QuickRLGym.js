import path from 'path';
import { FileStrategies } from 'quickrl.core';
import { writeFile, readFile, mkdir } from 'fs/promises';

/**
 * Options for Json File Strategy
 * @category Node
 * @subcategory FileStrategies
 * @property {string} filePath The path to the file
 */
export interface JSONFileOptions {
    filePath: string;
}

/**
 * File Saver for saving json files in node
 * @category Node
 * @subcategory FileStrategies
 * @implements JSONSaver
 * @param {JSONFileOptions} options save options
 */
export class NodeJSONFileSaver<T extends object>
    implements FileStrategies.JSONSaver<T>
{
    private options: JSONFileOptions;
    constructor(options: JSONFileOptions) {
        this.options = options;
    }

    async save(data: T): Promise<boolean> {
        const folderPath = path.dirname(this.options.filePath);
        await mkdir(folderPath, { recursive: true }).catch(() => {
            console.error('something went wrong');
            return false;
        });
        await writeFile(this.options.filePath, JSON.stringify(data));
        return true;
    }
}

/**
 * File Loader for loading json files in node
 * @category Node
 * @subcategory FileStrategies
 * @implements JSONLoader
 * @param {JSONFileOptions} options load options
 */
export class NodeJSONFileLoader<T extends object>
    implements FileStrategies.JSONLoader<T>
{
    private options: JSONFileOptions;
    constructor(options: JSONFileOptions) {
        this.options = options;
    }

    async load(): Promise<T> {
        let qtable: Buffer = await readFile(this.options.filePath);
        return JSON.parse(qtable.toString());
    }
}
