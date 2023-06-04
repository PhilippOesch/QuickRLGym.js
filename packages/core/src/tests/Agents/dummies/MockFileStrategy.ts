import { FileStrategy } from '../../..';

export default class DummyFileStrategy<T> implements FileStrategy<T> {
    private cache?: T = undefined;

    async load(): Promise<T> {
        return <T>this.cache;
    }
    async save(saveObject: T): Promise<boolean> {
        this.cache = saveObject;
        return true;
    }
}
