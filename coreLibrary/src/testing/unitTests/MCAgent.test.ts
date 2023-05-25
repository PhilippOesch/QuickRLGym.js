import { strict as assert } from 'node:assert';
import { describe } from 'mocha';
import { MCAgent, MCAgentSettings } from '../../Agents';
import { EnvOptions } from '../../RLInterface/Environment';
import { BlackJackEnv } from '../../Envs';
import { QuickRLJS } from '../../index';
import sinon from 'sinon';
import FileStrategy from '../../RLInterface/FileStrategy';
import { MCSaveFormat } from '../../Agents/MCAgent/MCAgent';

describe('MCAgent', function () {
    let env: BlackJackEnv;
    let agent: MCAgent;

    const envOptions: EnvOptions = {
        randomSeed: 135,
    };
    const agentRandomSeed = 134;

    const agentConfig: MCAgentSettings = {
        epsilonStart: 0.9,
        epsilonDecaySteps: 100,
        epsilonEnd: 0.1,
        discountFactor: 0.9,
    };

    this.beforeEach(function () {
        env = <BlackJackEnv>QuickRLJS.loadEnv('BlackJack', envOptions);
        agent = new MCAgent(env, agentConfig, agentRandomSeed);

        env.agent = agent;
        env.initAgent();
    });

    it('config', function () {
        assert.deepStrictEqual(agentConfig, agent.config);
    });

    it('initial valueTable', function () {
        const expectedDim = [32, 11, 2, 2];
        const expectedMean = 0;

        assert.deepStrictEqual(expectedDim, agent.valueTable.dim);
        assert.strictEqual(expectedMean, agent.valueTable.mean);
    });

    it('initial stateReturnCountTable', function () {
        const expectedDim = [32, 11, 2, 2];
        const expectedMean = 0;

        assert.deepStrictEqual(expectedDim, agent.stateReturnCountTable.dim);
        assert.strictEqual(expectedMean, agent.stateReturnCountTable.mean);
    });

    it('evalStep', function () {
        // initila valueTable== 0 so expected action is index 0 -> 'Stick'
        const expectedAction = 'Stick';

        assert.strictEqual(agent.evalStep(env.state), expectedAction);
    });

    it('step', function () {
        const expectedAction = 'Stick';

        assert.strictEqual(agent.step(env.state), expectedAction);
    });

    it('feed', async function () {
        const spy = sinon.spy(agent);

        const prevState = env.state;
        const action = agent.step(env.state);
        const stepResult = env.step(action);

        // manipulate the game state context for testing.
        const envStateContext = {
            isTerminal: false,
            maxIterationReached: false,
        };
        await agent.feed(
            prevState,
            action,
            stepResult.newState,
            stepResult.reward,
            envStateContext
        );

        assert.strictEqual(1, spy.step.callCount);
        assert.strictEqual(1, spy.feed.callCount);
        assert.strictEqual(1, agent.experience.length);
    });

    it('testDecayStepCalled', async function () {
        const spy = sinon.spy(agent);

        const prevState = env.state;
        const action = agent.step(env.state);
        const stepResult = env.step(action);
        const envStateContext = env.additionalInfo();

        await agent.feed(
            prevState,
            action,
            stepResult.newState,
            stepResult.reward,
            envStateContext
        );

        console.log('envStateContext', envStateContext);

        assert.strictEqual(spy.decayEpsilon.callCount, 1);
    });

    describe('test loading and saving interface', function () {
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
            it('save', function () {
                agent.save(fileStrategy);

                const cache: MCSaveFormat = <MCSaveFormat>fileStrategy.cache;
                assert.strictEqual(spy.save.callCount, 1);
                assert.notStrictEqual(cache.valueTable, undefined);
                assert.notStrictEqual(cache.stateReturnCountTable, undefined);
            });

            it('load', async function () {
                agent.save(fileStrategy);

                await assert.doesNotReject(async () => {
                    await agent.load(fileStrategy);
                }, Error);
                assert.strictEqual(true, spy.load.calledAfter(spy.save));
                assert.strictEqual(true, spy.save.calledOnce);
                assert.strictEqual(true, spy.load.calledOnce);
            });

            it('rejects because empty cache', async function () {
                await assert.rejects(
                    async () => {
                        await agent.load(fileStrategy);
                    },
                    Error,
                    'object is missing important attributes for conversion'
                );
            });
        });

        describe('config', function () {
            it('save', async function () {
                await agent.saveConfig(fileStrategy);

                assert.deepStrictEqual(agent.config, fileStrategy.cache);
                assert.strictEqual(true, spy.save.calledOnce);
            });

            it('save', async function () {
                await agent.saveConfig(fileStrategy);
                await agent.loadConfig(fileStrategy);

                assert.deepStrictEqual(agent.config, agentConfig);
                assert.strictEqual(true, spy.save.calledOnce);
                assert.strictEqual(true, spy.load.calledOnce);
            });
        });
    });
});
