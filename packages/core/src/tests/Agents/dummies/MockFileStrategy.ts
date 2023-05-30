import { FileStrategy } from '../../..';

export default class DummyFileStrategy implements FileStrategy {
    private cache: object = {};

    async load(): Promise<object> {
        return this.cache;
    }
    async save(saveObject: object): Promise<boolean> {
        this.cache = saveObject;
        return true;
    }
}
