import Environment, { EnvOptions } from './Environment';
import { SingleAgentEnvironment } from './SingleAgentEnvironment';
import * as Envs from '../Envs/';
/**
 * The the typ of enviroment
 * @category QuickRLInterface
 * @alias EnvType
 */
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
 * @param {?EnvOptions} options - options to use for instantiating environment
 * @param {?object} initialState - initial state of the environment
 * @returns {Environment | undefined} an instatiated object of the environment or undefined
 */
export function loadEnv<T extends Environment>(
    name: string,
    options?: EnvOptions,
    initialState?: object
): T | undefined {
    if (registery.has(name)) {
        const env = registery.get(name) as any;
        const newEnv: Environment = new env();
        newEnv.init(options, initialState);
        return <T>newEnv;
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
 * @param {string} name - name of the environment to register.
 * @param {EnvType} envtype - The referenct to the environment class
 */
export function register(name: string, envtype: EnvType): void {
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

/**
 * Predefined Environment keys
 */
export type EnvKey = 'Taxi' | 'BlackJack';

// registering standard environments
register('Taxi', Envs.TaxiEnv);
register('BlackJack', Envs.BlackJackEnv);
register('GridWorld', Envs.GridWorldEnv);
