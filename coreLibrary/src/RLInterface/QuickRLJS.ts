import Environment from './Environment';
import { Envs, SingleAgentEnvironment } from '../index';

type EnvType = typeof Environment;

/**
 * Main Class for Framework
 * @module QuickRLJS
 * @category QuickRLInterface
 */

const registery: Map<string, EnvType> = new Map();

/**
 * load a registered environment class
 * @param {string} name - Name of the environment
 * @param {object} options - options to use for instantiating environment
 * @param {initialState} initialState - initial state of the environment
 * @returns - an instatiated object of the environment
 */
export function loadEnv(
    name: string,
    options?: object,
    initialState?: object
): Environment | undefined {
    if (registery.has(name)) {
        const env = registery.get(name) as any;
        const newEnv: Environment = new env();
        newEnv.init(options, initialState);
        return newEnv;
    }
    return undefined;
}

/**
 * Returns all registered environment names
 * @returns {string[]} a list of environment names
 */
export function listEnvs(): string[] {
    return Array.from(registery.keys());
}

/**
 * Register a new environment within the framework.
 * @param name - name of the environment to register.
 * @param envtype - The referenct to the environment class
 */
export function register(name: string, envtype: typeof Environment): void {
    if (nameAlreadyRegistered(name)) {
        throw new Error('The specified Environment name is already registered');
    }

    if (
        !(envtype.prototype instanceof Environment) &&
        envtype !== SingleAgentEnvironment
    ) {
        throw new Error('The provided envtype must be of type "Environment"');
    }

    if (envTypeAlreadyRegistered(envtype)) {
        throw new Error(
            'The Environment is already registered under a different name'
        );
    }

    registery.set(name, envtype);
}

function envTypeAlreadyRegistered(envtype: typeof Environment): boolean {
    const envTypes = new Set(registery.values());
    return envTypes.has(envtype);
}

function nameAlreadyRegistered(envName: string): boolean {
    const envNames = new Set(registery.keys());
    return envNames.has(envName);
}

// registering standard environments
register('Taxi', Envs.TaxiEnv);
register('BlackJack', Envs.BlackJackEnv);
