import {
    EnvOptions,
    Environment,
    StepResult,
    QuickRLJS,
    SingleAgentEnvironment,
    Envs,
} from '../..';

class DummyEnv extends Environment {
    get stateDim(): number[] {
        throw new Error('Method not implemented.');
    }
    get actionSpace(): string[] {
        throw new Error('Method not implemented.');
    }
    get state(): object {
        throw new Error('Method not implemented.');
    }
    get isTerminal(): boolean {
        throw new Error('Method not implemented.');
    }
    get options(): EnvOptions | undefined {
        throw new Error('Method not implemented.');
    }
    get iteration(): number {
        throw new Error('Method not implemented.');
    }
    get stats(): object {
        throw new Error('Method not implemented.');
    }
    get name(): string {
        throw new Error('Method not implemented.');
    }
    init(
        options?: EnvOptions | undefined,
        initialState?: object | undefined
    ): void {
        throw new Error('Method not implemented.');
    }
    step(action: string): StepResult<object> {
        throw new Error('Method not implemented.');
    }
    reset(): boolean {
        throw new Error('Method not implemented.');
    }
    setOptions(options?: EnvOptions | undefined): void {
        throw new Error('Method not implemented.');
    }
    encodeStateToIndices(state: object): number[] {
        throw new Error('Method not implemented.');
    }
    resetStats(): boolean {
        throw new Error('Method not implemented.');
    }
}

test('load - taxi env - is of correct type', () => {
    const taxiEnv = QuickRLJS.loadEnv('Taxi');

    expect(taxiEnv).not.toBeUndefined();
    expect(taxiEnv).toBeInstanceOf(Environment);
    expect(taxiEnv).toBeInstanceOf(SingleAgentEnvironment);
    expect(taxiEnv).toBeInstanceOf(Envs.TaxiEnv);
});

test('load - blackjack env - is of correct type', () => {
    const blackJackEnv = QuickRLJS.loadEnv('BlackJack');

    expect(blackJackEnv).not.toBeUndefined();
    expect(blackJackEnv).toBeInstanceOf(Environment);
    expect(blackJackEnv).toBeInstanceOf(SingleAgentEnvironment);
    expect(blackJackEnv).toBeInstanceOf(Envs.BlackJackEnv);
});

test('list of Envs - returns correct list', () => {
    const listOfEnvs = ['Taxi', 'BlackJack'];

    expect(listOfEnvs).toStrictEqual(QuickRLJS.listEnvs());
});

test('register - not allowed type - throws error', () => {
    const registerNotAllowedEnv = () =>
        QuickRLJS.register('TestEnv', {} as any);

    expect(registerNotAllowedEnv).toThrowError(
        'The provided envtype must be of type "Environment"'
    );
});

test('register - register environment a second time under different name - throws error', () => {
    const registerNotAllowedEnv = () =>
        QuickRLJS.register('TestEnv', Envs.TaxiEnv);

    expect(registerNotAllowedEnv).toThrowError(
        'The Environment is already registered under a different name'
    );
});

test('register - already existing environment name - throws an error', () => {
    const registerNotAllowedEnv = () => QuickRLJS.register('Taxi', DummyEnv);

    expect(registerNotAllowedEnv).toThrowError(
        'The specified Environment name is already registered'
    );
});

test('register - register new environment - throws no error', () => {
    const registerNotAllowedEnv = () => QuickRLJS.register('TestEnv', DummyEnv);

    expect(registerNotAllowedEnv).not.toThrowError();
});

test('load - try to load non existing environment - returns undefined', () => {
    const testName = 'NotExistingEnvironment';

    expect(QuickRLJS.loadEnv(testName)).toBeUndefined();
});
