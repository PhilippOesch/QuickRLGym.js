import FileManager from './FileManager';

export default interface TrainableAgent {
    load(fileManager: FileManager): Promise<void>;
    save(fileManager: FileManager): Promise<void>;
}
