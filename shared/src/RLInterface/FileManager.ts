interface FileManager {
    load(pathString: string): Promise<object>;
    save(pathString: string, saveObject: object): Promise<boolean>;
}

export default FileManager;
