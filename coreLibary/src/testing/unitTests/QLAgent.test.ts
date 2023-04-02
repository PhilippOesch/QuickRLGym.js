import { strict as assert } from 'node:assert';
import sinon from 'sinon';
import { describe } from 'mocha';
import { EnvOptions, FileStrategy, QuickRLJS } from '../..';
import { TaxiEnv } from '../../Envs';
import { QLAgent } from '../../Agents';

describe('QLAgent', function () {
    let env: TaxiEnv;
    let agent: QLAgent;

    const envOptions: EnvOptions = {
        randomSeed: 134,
    };
    const agentRandomSeed = 135;

    const agentConfig = {
        learningRate: 0.1,
        discountFactor: 0.9,
        epsilonStart: 0.9,
        epsilonDecaySteps: 100,
        epsilonEnd: 0.1,
    };

    this.beforeEach(function () {
        env = <TaxiEnv>QuickRLJS.loadEnv('Taxi', envOptions);
        agent = new QLAgent(env, agentConfig, agentRandomSeed);

        env.agent = agent;
        env.initAgent();
    });

    it('qTable', function () {
        const qTable = agent.qTable;

        const expectedDim: number[] = [5, 5, 4, 5, 6];
        assert.deepStrictEqual(expectedDim, qTable.dim);
    });

    it('config', function () {
        assert.deepStrictEqual(agentConfig, agent.config);
    });

    it('evalStep', function () {
        // at the beginnig where all qValues are 0, argMax should return the first defined action
        const action = agent.evalStep(env.state);
        assert.strictEqual(action, 'Up');
    });

    it('step', function () {
        const action = agent.step(env.state);
        // with the defined parameters and random seed, the action is 'Right'
        console.log(action, 'Right');
    });

    it('single feed loop', async function () {
        const maxIterationState = 10;

        const agentSpy = sinon.spy(agent);

        const prevState = env.state;
        const nextAction = agent.step(prevState);
        const { newState, reward } = env.step(nextAction);
        const gameStateContext = env.additionalInfo(maxIterationState);
        await agent.feed(
            prevState,
            nextAction,
            newState,
            reward,
            gameStateContext
        );

        // prevState = [0, 0, 2, 1]
        // selected action idx: 3
        // new State = [1, 0, 2, 1]
        // reward = -1

        // iteration: Q(s,a) = 0 + 0.1 * (-1 + (0.9*0)) = -0.1
        assert.strictEqual(-0.1, agent.qTable.get(0, 0, 2, 1, 3));
        assert.strictEqual(agentSpy.decayEpsilon.callCount, 0);
    });

    it('trainigLoop', async function () {
        const agentSpy = sinon.spy(agent);

        await env.train(10, 4, 5);

        assert.strictEqual(agentSpy.decayEpsilon.callCount, 10);
        assert.strictEqual(agentSpy.log.callCount, 4);
        assert.strictEqual(agentSpy.step.callCount, 50);
        assert.strictEqual(agentSpy.feed.callCount, 50);
    });

    describe('test saving interface', function () {
        let fileStrategy: MockFileStrategy;
        let spy: sinon.SinonSpiedInstance<MockFileStrategy>;

        this.beforeEach(function () {
            fileStrategy = new MockFileStrategy();
            spy = sinon.spy(fileStrategy);
        });

        class MockFileStrategy implements FileStrategy {
            public cache: object = {};

            async load(options?: object | undefined): Promise<object> {
                return this.cache;
            }
            async save(
                saveObject: object,
                options?: object | undefined
            ): Promise<boolean> {
                this.cache = saveObject;
                return true;
            }
        }

        describe('agent', function () {
            it('save', async function () {
                await agent.save(fileStrategy);
                assert.strictEqual(true, spy.save.calledOnce);
            });

            describe('load', function () {
                it('rejects because no qTable in cache', async function () {
                    await assert.rejects(
                        async () => {
                            await agent.load(fileStrategy);
                        },
                        Error,
                        'object is missing important attributes for conversion'
                    );
                });

                it('loading works correctly', async function () {
                    await agent.save(fileStrategy);

                    await assert.doesNotReject(async () => {
                        await agent.load(fileStrategy);
                    }, Error);

                    assert.strictEqual(true, spy.load.calledAfter(spy.save));
                    assert.strictEqual(true, spy.save.calledOnce);
                    assert.strictEqual(true, spy.load.calledOnce);
                });
            });
        });

        describe('config', function () {
            it('save config', async function () {
                await agent.saveConfig(fileStrategy);

                assert.deepStrictEqual(agent.config, fileStrategy.cache);
                assert.strictEqual(true, spy.save.calledOnce);
            });

            it('load config', async function () {
                await agent.saveConfig(fileStrategy);
                await agent.loadConfig(fileStrategy);

                assert.deepStrictEqual(agent.config, agentConfig);
                assert.strictEqual(true, spy.save.calledOnce);
                assert.strictEqual(true, spy.load.calledOnce);
            });
        });
    });
});
