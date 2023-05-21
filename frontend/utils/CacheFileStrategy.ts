import { Agent, FileStrategy } from 'quickrl.core';

class CacheFileStrategy implements FileStrategy {
    agentCache?: Agent;

    constructor() {}

    async load(options?: object | undefined): Promise<object> {
        if (this.agentCache) {
            return this.agentCache;
        }
        return {};
    }
    async save(saveObject: object): Promise<boolean> {
        this.agentCache = <Agent>saveObject;
        return true;
    }
}

export default CacheFileStrategy;
