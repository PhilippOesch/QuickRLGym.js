import Environment from './Environment';
import { Envs } from '../index';

/**
 * Main Class for Framework
 */
class QuickRLJS {
    /**
     * @property registery - registery for enviroment classes
     */
    private static registery: Map<string, typeof Environment> = new Map();

    /**
     * load a registered environment class
     * @param name - Name of the environment
     * @param options - options to use for instantiating environment
     * @param initialState - initial state of the environment
     * @returns - an instatiated object of the environment
     */
    static loadEnv(
        name: string,
        options?: object,
        initialState?: object
    ): Environment | undefined {
        if (QuickRLJS.registery.has(name)) {
            const env = QuickRLJS.registery.get(name) as any;
            const newEnv: Environment = new env();
            newEnv.init((options = options), (initialState = initialState));
            return newEnv;
        }
        return undefined;
    }

    /**
     * Register a new environment within the framework.
     * @param name - name of the environment to register.
     * @param envtype - The referenct to the environment class
     */
    static register(name: string, envtype: typeof Environment): void {
        QuickRLJS.registery.set(name, envtype);
    }
}

// registering standard enviroments
QuickRLJS.register('Taxi', Envs.TaxiEnv);
QuickRLJS.register('BlackJack', Envs.BlackJackEnv);

export default QuickRLJS;
