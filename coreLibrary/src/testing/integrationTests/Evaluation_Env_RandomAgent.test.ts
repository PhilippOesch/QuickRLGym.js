import { strict as assert } from 'node:assert';
import { describe } from 'mocha';
import { EnvOptions, QuickRLJS } from '../..';
import TaxiEnv, { TaxiStats } from '../../Envs/TaxiEnv';
import sinon from 'sinon';
import { RandomAgent } from '../../Agents';
import { benchmarkSingleAgent } from '../../Utils/Evaluation';
import { BlackJackEnv, BlackJackStats } from '../../Envs';

describe('Evaluation TaxiEnv Random Agent Integration', function () {
    it('benchmark TaxiEnv', function () {
        const envOptions: EnvOptions = {
            randomSeed: 123,
        };
        const agentRandomSeed = 15;
        const env: TaxiEnv = <TaxiEnv>QuickRLJS.loadEnv('Taxi', envOptions);
        const agent: RandomAgent = new RandomAgent(env, agentRandomSeed);
        agent.init();

        const spyObjectEnv = sinon.spy(env);
        const spyObjectAgent = sinon.spy(agent);

        const stats: TaxiStats = <TaxiStats>(
            benchmarkSingleAgent(env, agent, 10, 20, 10)
        );

        assert.strictEqual(10, stats.averageGameIterations);
        assert.strictEqual(-35.2, stats.averageGameScore);
        assert.strictEqual(spyObjectEnv.step.callCount, 10 * 10);
        assert.strictEqual(spyObjectEnv.onIterationEnd.callCount, 10);
        assert.strictEqual(spyObjectAgent.evalStep.callCount, 10 * 10);
        assert.strictEqual(spyObjectEnv.reset.callCount, 11);
    });

    it('benchmark BlackJack', function () {
        const envOptions: EnvOptions = {
            randomSeed: 123,
        };
        const agentRandomSeed = 15;
        const env: BlackJackEnv = <BlackJackEnv>(
            QuickRLJS.loadEnv('BlackJack', envOptions)
        );
        const agent: RandomAgent = new RandomAgent(env, agentRandomSeed);
        agent.init();

        const spyObjectEnv = sinon.spy(env);
        const spyObjectAgent = sinon.spy(agent);

        const stats: BlackJackStats = <BlackJackStats>(
            benchmarkSingleAgent(env, agent, 10, 20, 10)
        );

        assert.strictEqual(0.2, stats.averageReturn);
        assert.strictEqual(20.6, stats.averageDealerScore);
        assert.strictEqual(16.8, stats.averagePlayerScore);
        assert.strictEqual(spyObjectEnv.step.callCount, 14);
        assert.strictEqual(spyObjectEnv.onIterationEnd.callCount, 10);
        assert.strictEqual(spyObjectAgent.evalStep.callCount, 14);
        assert.strictEqual(spyObjectEnv.reset.callCount, 11);
    });
});
