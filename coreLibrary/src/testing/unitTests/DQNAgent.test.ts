import { describe } from 'mocha';
import sinon from 'sinon';
import { TaxiEnv } from '../../Envs';
import { QuickRLJS } from '../../RLInterface/QuickRLJS';
import { EnvOptions } from '../../RLInterface/Environment';
import { DQNAgent, DQNAgentSettings, ReplayMemory } from '../../Agents';
import assert from 'node:assert';
import { TaxiGameState } from '../../Games/TaxiGame';
import { Vec2 } from '../../Utils';
import seedrandom from 'seedrandom';
import { DQNNetwork } from '../../Agents/DQNAgent/DQNAgent';
import FileStrategy from '../../RLInterface/FileStrategy';

describe('DQNAgent', function () {
    let env: TaxiEnv;
    let agent: DQNAgent;
    let spy: sinon.SinonSpiedInstance<DQNAgent>;

    const envOptions: EnvOptions = {
        randomSeed: 134,
    };

    const agentRandomSeed = 135;

    const agentConfig: DQNAgentSettings = {
        learningRate: 0.001,
        discountFactor: 0.5,
        nnLayer: [16, 16],
        replayMemorySize: 10,
        batchSize: 32,
        replayMemoryInitSize: 5,
        epsilonStart: 1,
        epsilonEnd: 0.1,
        epsilonDecaySteps: 50,
        activateDoubleDQN: true,
        updateTargetEvery: 5,
    };

    this.beforeEach(function () {
        env = <TaxiEnv>QuickRLJS.loadEnv('Taxi', envOptions);
        agent = new DQNAgent(env, agentConfig, agentRandomSeed);
        spy = sinon.spy(agent);
    });

    it('initialization', function () {
        agent.init();

        assert.strictEqual(true, spy.init.calledOnce);
        assert.strictEqual(2, spy.createNetwork.callCount);
    });

    describe('ReplayMemory', function () {
        let replayMemory: ReplayMemory;
        let rMSpy: sinon.SinonSpiedInstance<ReplayMemory>;
        let sampleRandomSeed: number = 15;
        let prevState: TaxiGameState = {
            playerPos: new Vec2(0, 0),
            destinationIdx: 0,
            customerPosIdx: 0,
        };

        this.beforeEach(function () {
            replayMemory = new ReplayMemory(10);
            rMSpy = sinon.spy(replayMemory);
        });

        it('after Initialization', function () {
            assert.strictEqual(0, replayMemory.length);
            assert.strictEqual(10, replayMemory.maxSize);
        });

        describe('with generated test data', function () {
            this.beforeEach(function () {
                for (let i = 1; i <= 10; i++) {
                    let newState = {
                        playerPos: new Vec2(i, i),
                        destinationIdx: i,
                        customerPosIdx: i,
                    };

                    replayMemory.save({
                        prevState: env.encodeStateToIndices(prevState),
                        takenAction: i,
                        newState: env.encodeStateToIndices(newState),
                        payoff: i,
                        contextInfo: {
                            isTerminal: false,
                            maxIterationReached: false,
                        },
                    });

                    prevState = newState;
                }
            });

            it('correct replay memory size', function () {
                assert.strictEqual(replayMemory.length, 10);
            });

            it('correct number of saves called', function () {
                assert.strictEqual(rMSpy.save.callCount, 10);
            });

            it('sample', function () {
                const samples = replayMemory.sample(
                    4,
                    seedrandom(sampleRandomSeed.toString())
                );

                assert.strictEqual(4, samples.stateBatch.length);
                assert.strictEqual(4, samples.actionBatch.length);
                assert.strictEqual(4, samples.newStateBatch.length);
                assert.strictEqual(4, samples.payoffBatch.length);
                assert.strictEqual(4, samples.contextInfoBatch.length);

                assert.strictEqual(2, samples.payoffBatch[0]);
                assert.strictEqual(10, samples.payoffBatch[1]);
                assert.strictEqual(8, samples.payoffBatch[2]);
                assert.strictEqual(3, samples.payoffBatch[3]);
            });

            it('testSize exceding', function () {
                replayMemory.save({
                    prevState: env.encodeStateToIndices(prevState),
                    takenAction: 11,
                    newState: env.encodeStateToIndices(prevState),
                    payoff: 11,
                    contextInfo: {
                        isTerminal: false,
                        maxIterationReached: false,
                    },
                });

                assert.strictEqual(10, replayMemory.length);

                const samples = replayMemory.sample(
                    10,
                    seedrandom(sampleRandomSeed.toString())
                );

                const found = samples.payoffBatch.find(
                    (payoff: number) => payoff == 1
                );

                assert.strictEqual(found, undefined);
            });
        });
    });

    describe('config', function () {
        const agentConfig: DQNAgentSettings = {
            learningRate: 0.001,
            discountFactor: 0.5,
            nnLayer: [16, 16],
            replayMemorySize: 10,
            batchSize: 32,
            replayMemoryInitSize: 5,
            epsilonStart: 1,
            epsilonEnd: 0.1,
            epsilonDecaySteps: 50,
            activateDoubleDQN: true,
            updateTargetEvery: 6,
        };

        const randomSeed = 18;

        it('setconfig', function () {
            agent.setConfig(agentConfig, randomSeed);

            assert.strictEqual(true, spy.setConfig.calledOnce);
        });

        it('set then get config', function () {
            agent.setConfig(agentConfig, randomSeed);

            assert.strictEqual(true, spy.setConfig.calledOnce);
            assert.deepStrictEqual(agentConfig, agent.config);
        });
    });

    it('step', function () {
        agent.init();

        const prevState = env.state;
        agent.step(prevState);

        assert.strictEqual(true, spy.step.calledOnce);
        assert.strictEqual(0, spy.evalStep.callCount);
    });

    describe('initialization', function () {
        it('Normal DQN', function () {
            const agentConfig: DQNAgentSettings = {
                learningRate: 0.001,
                discountFactor: 0.5,
                nnLayer: [16, 16],
                replayMemorySize: 10,
                batchSize: 32,
                replayMemoryInitSize: 5,
                epsilonStart: 1,
                epsilonEnd: 0.1,
                epsilonDecaySteps: 50,
                activateDoubleDQN: false,
                updateTargetEvery: 6,
            };

            agent.setConfig(agentConfig);
            agent.init();

            assert.strictEqual(true, agent.network.local !== undefined);
            assert.strictEqual(true, agent.network.target == undefined);
        });

        it('Double DQN', function () {
            const agentConfig: DQNAgentSettings = {
                learningRate: 0.001,
                discountFactor: 0.5,
                nnLayer: [16, 16],
                replayMemorySize: 10,
                batchSize: 32,
                replayMemoryInitSize: 5,
                epsilonStart: 1,
                epsilonEnd: 0.1,
                epsilonDecaySteps: 50,
                activateDoubleDQN: true,
                updateTargetEvery: 6,
            };

            agent.setConfig(agentConfig);
            agent.init();

            assert.strictEqual(true, agent.network.local !== undefined);
            assert.strictEqual(true, agent.network.target !== undefined);
        });
    });

    describe('feed', function () {
        it('single feed', async function () {
            agent.init();

            const rMSpy = sinon.spy(agent.replayMemory);

            const prevState = env.state;
            const action = agent.step(prevState);
            const { newState, reward } = env.step(action);
            const gameState = env.additionalInfo();

            await agent.feed(prevState, action, newState, reward, gameState);

            assert.strictEqual(true, rMSpy.save.calledOnce);
            assert.strictEqual(true, spy.feed.calledOnce);
        });
    });

    describe('file strategy', function () {
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

        let fileStrategy: MockFileStrategy;
        let fmSpy: sinon.SinonSpiedInstance<MockFileStrategy>;

        this.beforeEach(function () {
            fileStrategy = new MockFileStrategy();
            fmSpy = sinon.spy(fileStrategy);
        });

        describe('model', function () {
            it('save', async function () {
                agent.init();
                await agent.save(fileStrategy);

                assert.strictEqual(fileStrategy.cache, agent.network.local);
                assert.strictEqual(true, fmSpy.save.calledOnce);
                assert.strictEqual(true, spy.save.calledOnce);
            });

            it('load', async function () {
                agent.init();
                await agent.save(fileStrategy);
                const res = await agent.load(fileStrategy);

                assert.strictEqual(fileStrategy.cache, agent.network.local);
                assert.strictEqual(true, fmSpy.save.calledOnce);
                assert.strictEqual(true, spy.save.calledOnce);
                assert.strictEqual(2, fmSpy.load.callCount);
                assert.strictEqual(true, spy.load.calledOnce);
                assert.strictEqual(true, fmSpy.load.calledAfter(fmSpy.save));
            });
        });

        describe('config', function () {
            it('save', async function () {
                agent.init();
                await agent.saveConfig(fileStrategy);

                assert.deepStrictEqual(agent.config, fileStrategy.cache);
                assert.strictEqual(true, fmSpy.save.calledOnce);
            });

            it('load', async function () {
                agent.init();
                await agent.saveConfig(fileStrategy);
                await agent.loadConfig(fileStrategy);

                assert.deepStrictEqual(agent.config, fileStrategy.cache);
                assert.strictEqual(true, fmSpy.save.calledOnce);
                assert.strictEqual(true, fmSpy.load.calledOnce);
                assert.strictEqual(true, spy.saveConfig.calledOnce);
                assert.strictEqual(true, spy.loadConfig.calledOnce);
                assert.strictEqual(true, fmSpy.load.calledAfter(fmSpy.save));
            });
        });
    });
});
