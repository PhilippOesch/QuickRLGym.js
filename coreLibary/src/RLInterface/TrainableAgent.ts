import FileManager from './FileManager';

export default interface TrainableAgent {
    load(pathString: string, fileManager: FileManager): Promise<void>;
    save(pathString: string, fileManager: FileManager): Promise<void>;
}
