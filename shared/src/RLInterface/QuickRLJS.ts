import Environment from './Environment';
import { TaxiEnv, BlackJackEnv } from '../index';

class QuickRLJS {
    public static registery: Map<string, typeof Environment> = new Map();

    public static loadEnv(
        name: string,
        options: object,
        initialState?: object
    ): Environment | undefined {
        if (QuickRLJS.registery.has(name)) {
            const env = QuickRLJS.registery.get(name) as any;
            return new env(options, initialState);
        }
        return undefined;
    }

    public static register(name: string, envtype: typeof Environment): void {
        QuickRLJS.registery.set(name, envtype);
    }
}

QuickRLJS.register('Taxi', TaxiEnv);
QuickRLJS.register('BlackJack', BlackJackEnv);

export default QuickRLJS;
