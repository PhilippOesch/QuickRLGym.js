import { Environment, SingleAgentEnvironment } from '../../../shared/src';

export default abstract class BrowserAgent {
    protected env: Environment;

    constructor(env: Environment) {
        this.env = env;
    }

    public abstract load(): Promise<void>;

    public abstract evalStep(state: object): string;
}
