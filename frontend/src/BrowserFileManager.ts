import { FileManager } from '../../shared/src';

class BrowserFileManager implements FileManager {
    public async load(pathString: string): Promise<object> {
        const result: Response = await fetch(pathString);
        const jsonObject = await result.json();
        // const  = new Tensor(jsonObject.dim, jsonObject.array);
        return jsonObject;
    }
    public async save(
        pathString: string,
        saveObject: object
    ): Promise<boolean> {
        throw new Error('Method not implemented.');
    }
}

export default BrowserFileManager;
