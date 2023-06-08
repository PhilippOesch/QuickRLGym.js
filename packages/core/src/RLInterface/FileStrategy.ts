import tf from '@tensorflow/tfjs';

export interface FileLoader<T> {
    load(): Promise<T>;
}

export interface FileSaver<T> {
    save(data: T): Promise<boolean>;
}

export interface JSONLoader<T extends object> extends FileLoader<T> {
    load(): Promise<T>;
}

export interface JSONSaver<T extends object> extends FileSaver<T> {
    save(data: T): Promise<boolean>;
}

export interface TFModelLoad<T extends tf.LayersModel> extends FileLoader<T> {
    load(): Promise<T>;
}

export interface TFModelSave<T extends tf.LayersModel> extends FileSaver<T> {
    save(data: T): Promise<boolean>;
}
