import { strict as assert } from 'node:assert';
import sinon from 'sinon';
import { describe } from 'mocha';
import SingleAgentEnvironment from '../../RLInterface/SingleAgentEnvironment';
import StepResult from '../../RLInterface/StepResult';
import Agent from '../../RLInterface/Agent';
import { EnvOptions } from '../../RLInterface/Environment';

class MockSAEnv extends SingleAgentEnvironment {
    get stateDim(): number[] {
        throw new Error('stateDim not implemented.');
    }
    get stats(): object {
        throw new Error('stats not implemented.');
    }
    get name(): string {
        throw new Error('name not implemented.');
    }
    public resetStats(): boolean {
        throw new Error('resetStats not implemented.');
    }
    public get actionSpace(): string[] {
        throw new Error('Method not implemented.');
    }
    public step(action: string): StepResult {
        throw new Error('Method not implemented.');
    }
    public get getReturn(): number {
        throw new Error('Method not implemented.');
    }
    public get state(): object {
        throw new Error('Method not implemented.');
    }
    public reset(): boolean {
        throw new Error('Method not implemented.');
    }
    public get isTerminal(): boolean {
        throw new Error('Method not implemented.');
    }
    public get iteration(): number {
        throw new Error('Method not implemented.');
    }
    public encodeStateToIndices(state: object): number[] {
        throw new Error('Method not implemented.');
    }
}

class MockAgent extends Agent {
    init(): void {}
    step(state: object): string {
        return 'action';
    }
    async feed(
        prevState: object,
        takenAction: string,
        newState: object,
        payoff: number,
        contextInfo: object
    ): Promise<void> {}
    setConfig(
        config?: object | undefined,
        randomSeed?: number | undefined
    ): void {}
    get config(): object | undefined {
        return {};
    }
    evalStep(state: object): string {
        return 'action';
    }
    log(): void {}
}

describe('SingleAgentEnvironment', function () {
    const env = new MockSAEnv();
    const agent = new MockAgent(env);

    const mockEnv = sinon.mock(env);
    let isTerminal = false;
    let iteration = 0;

    const stepStub = sinon
        .stub(env, 'step')
        .callsFake(function (action: string) {
            iteration++;
            isTerminal = true;
            return {
                newState: {
                    action: 'action',
                },
                reward: 0,
            };
        });

    const resetStub = sinon.stub(env, 'reset').callsFake(function () {
        isTerminal = false;
        return true;
    });

    const resetStatsMock = mockEnv.expects('resetStats');
    resetStatsMock.returns(true);

    describe('getter stubs', function () {
        it('actionSpace stub', function () {
            sinon.stub(env, 'actionSpace').get(() => ['action']);
            assert.strictEqual('action', env.actionSpace[0]);
        });

        it('isTerminal stub', function () {
            sinon.stub(env, 'isTerminal').get(() => isTerminal);
            assert.strictEqual(false, env.isTerminal);
        });

        it('getReturn stub', function () {
            sinon.stub(env, 'getReturn').get(() => 1);
            assert.strictEqual(1, env.getReturn);
        });

        it('state stub', function () {
            sinon.stub(env, 'state').get(() => {
                return {
                    state: 'state',
                };
            });
            assert.strictEqual((env.state as any).state, 'state');
        });

        it('iteration stub', function () {
            iteration = 0;
            sinon.stub(env, 'iteration').get(() => iteration);

            assert.strictEqual(env.iteration, 0);
        });
    });

    describe('mock methods', function () {
        it('resetStats', function () {
            resetStatsMock.exactly(1);
            env.resetStats();
            resetStatsMock.verify();
            resetStatsMock.reset();
        });

        it('reset', function () {
            const res = env.reset();
            assert.strictEqual(res, true);
            assert.strictEqual(env.isTerminal, false);

            resetStub.resetHistory();
        });

        it('step', function () {
            const result = <any>env.step('action');

            assert.strictEqual(result.reward, 0);
            assert.strictEqual(result.newState.action, 'action');
            assert.strictEqual(env.isTerminal, true);
        });

        it('encodeStateToIndices', function () {
            const encodeMock = mockEnv.expects('encodeStateToIndices');
            encodeMock.exactly(1);
            encodeMock.returns([0]);
            env.encodeStateToIndices({ state: 'state' });
            encodeMock.verify();
        });
    });

    describe('initAgent', function () {
        it('without an agent set', function () {
            assert.throws(
                () => env.initAgent(),
                Error,
                'initAgent can not be called without an agent set'
            );
        });

        it('normal Initialisation', function () {
            const mockMethod = mockEnv.expects('initAgent');
            mockMethod.exactly(1);
            env.agent = agent;
            env.initAgent();
            mockMethod.verify();
        });
    });

    describe('agent setter and getter', function () {
        it('set and get agent', function () {
            const agent = new MockAgent(env);
            env.agent = agent;

            assert.strictEqual(agent, env.agent);
        });
    });

    describe('lastAction', function () {
        it('get last action', function () {
            assert.strictEqual(env.lastAction, undefined);
        });
    });

    describe('setOptions', function () {
        it('option is set', function () {
            const options: EnvOptions = { randomSeed: 15 };
            env.setOptions(options);
            assert.strictEqual(options, env.options);
        });
    });

    describe('training', function () {
        it('agent not set', async function () {
            const numIterations = 10;
            const maxIterationPerGame = 10;
            const logEvery = -1;

            env.agent = undefined;
            resetStatsMock.exactly(1);
            assert.rejects(
                env.train(numIterations, logEvery, maxIterationPerGame)
            );

            resetStatsMock.verify();
            resetStub.resetHistory();
            resetStatsMock.resetHistory();
        });

        it('train', async function () {
            const numIterations = 10;
            const maxIterationPerGame = 10;
            const logEvery = -1;

            resetStatsMock.exactly(1);
            env.agent = agent;
            const res = await env.train(
                numIterations,
                logEvery,
                maxIterationPerGame
            );
            assert.strictEqual(res, numIterations);
            assert.strictEqual(stepStub.callCount, numIterations);
            assert.strictEqual(resetStub.callCount, numIterations + 1);
            resetStatsMock.verify();
            stepStub.resetHistory();
            resetStub.resetHistory();
            resetStatsMock.resetHistory();
        });

        it('logging', async function () {
            resetStatsMock.reset();

            const numIterations = 10;
            const maxIterationPerGame = 10;
            const logEvery = 4;

            const logSpy = sinon.spy(env, 'log');
            resetStatsMock.exactly(4);

            env.agent = agent;
            await env.train(numIterations, logEvery, maxIterationPerGame);
            assert.strictEqual(logSpy.callCount, 4); // once at 0; at 4 at 8 and at the last step: 10

            //resetStatsMock.verify();
            stepStub.resetHistory();
            resetStub.resetHistory();
            resetStatsMock.reset();
        });
    });
});
