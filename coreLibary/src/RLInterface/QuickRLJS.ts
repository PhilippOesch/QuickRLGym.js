import Environment from './Environment';
import { Envs, SingleAgentEnvironment } from '../index';

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
    public static loadEnv(
        name: string,
        options?: object,
        initialState?: object
    ): Environment | undefined {
        if (QuickRLJS.registery.has(name)) {
            const env = QuickRLJS.registery.get(name) as any;
            const newEnv: Environment = new env();
            newEnv.init(options, initialState);
            return newEnv;
        }
        return undefined;
    }

    /**
     * Register a new environment within the framework.
     * @param name - name of the environment to register.
     * @param envtype - The referenct to the environment class
     */
    public static register(name: string, envtype: typeof Environment): void {
        if (QuickRLJS.nameAlreadyRegistered(name)) {
            throw new Error(
                'The specified Environment name is already registered'
            );
        }

        if (
            !(envtype.prototype instanceof Environment) &&
            envtype !== SingleAgentEnvironment
        ) {
            throw new Error(
                'The provided envtype must be of type "Environment"'
            );
        }

        if (QuickRLJS.envTypeAlreadyRegistered(envtype)) {
            throw new Error(
                'The Environment is already registered under a different name'
            );
        }

        QuickRLJS.registery.set(name, envtype);
    }

    private static envTypeAlreadyRegistered(
        envtype: typeof Environment
    ): boolean {
        const envTypes = new Set(QuickRLJS.registery.values());
        return envTypes.has(envtype);
    }

    private static nameAlreadyRegistered(envName: string): boolean {
        const envNames = new Set(QuickRLJS.registery.keys());
        return envNames.has(envName);
    }
}

// registering standard environments
QuickRLJS.register('Taxi', Envs.TaxiEnv);
QuickRLJS.register('BlackJack', Envs.BlackJackEnv);

export { QuickRLJS };
