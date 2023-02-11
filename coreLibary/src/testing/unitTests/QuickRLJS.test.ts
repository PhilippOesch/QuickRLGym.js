import { strict as assert } from 'node:assert';
import {
    Environment,
    EnvOptions,
    QuickRLJS,
    SingleAgentEnvironment,
    StepResult,
} from '../../index';
import { describe } from 'mocha';
import { BlackJackEnv, TaxiEnv } from '../../Envs';

//Mock Environment for registering;
class MockEnv extends Environment {
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
        console.log(options, initialState);
        throw new Error('Method not implemented.');
    }
    step(action: string): StepResult {
        console.log(action);
        throw new Error('Method not implemented.');
    }
    reset(): boolean {
        throw new Error('Method not implemented.');
    }
    setOptions(options?: EnvOptions | undefined): void {
        console.log(options);
        throw new Error('Method not implemented.');
    }
    encodeStateToIndices(state: object): number[] {
        console.log(state);
        throw new Error('Method not implemented.');
    }
    resetStats(): boolean {
        throw new Error('Method not implemented.');
    }
}

describe('QuickRLJS', function () {
    describe('load', function () {
        it('load Taxi Env', function () {
            const taxiEnv = QuickRLJS.loadEnv('Taxi');
            assert.strictEqual(true, taxiEnv instanceof Environment);
            assert.strictEqual(true, taxiEnv instanceof SingleAgentEnvironment);
            assert.strictEqual(true, taxiEnv instanceof TaxiEnv);
        });

        it('load BlackJackEnv', function () {
            const blackJackEnv = QuickRLJS.loadEnv('BlackJack');
            assert.strictEqual(true, blackJackEnv instanceof Environment);
            assert.strictEqual(
                true,
                blackJackEnv instanceof SingleAgentEnvironment
            );
            assert.strictEqual(true, blackJackEnv instanceof BlackJackEnv);
        });
    });

    describe('register', function () {
        it('register not allowed type throws error', function () {
            const registerNotAllowedEnv = () =>
                QuickRLJS.register('TestEnv', {} as any);
            assert.throws(
                registerNotAllowedEnv,
                Error,
                'The provided envtype must be of type "Environment"'
            );
        });

        it('register Environment a second time under a different name throws an error', function () {
            const registerNotAllowedEnv = () =>
                QuickRLJS.register('TestEnv', TaxiEnv);
            assert.throws(
                registerNotAllowedEnv,
                Error,
                'The Environment is already registered under a different name'
            );
        });

        it('registering an already existing environment name throws an error', function () {
            const registerNotAllowedEnv = () =>
                QuickRLJS.register('Taxi', MockEnv);
            assert.throws(
                registerNotAllowedEnv,
                Error,
                'The specified Environment name is already registered'
            );
        });

        it('register new environment', function () {
            const registeringWithNoError = () => {
                QuickRLJS.register('TestEnv', MockEnv);
            };

            assert.doesNotThrow(registeringWithNoError, Error);
        });
    });
});
