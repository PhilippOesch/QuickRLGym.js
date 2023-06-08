import { FileStrategies } from '../../..';

export default class DummyFileStrategy<T extends object>
    implements FileStrategies.JSONSaver<T>, FileStrategies.JSONLoader<T>
{
    private cache?: T = undefined;

    async load(): Promise<T> {
        return <T>this.cache;
    }
    async save(data: T): Promise<boolean> {
        this.cache = data;
        return true;
    }
}
