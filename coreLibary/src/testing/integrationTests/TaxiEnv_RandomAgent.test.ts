import { strict as assert } from 'node:assert';
import sinon from 'sinon';
import { describe } from 'mocha';
import { TaxiEnv } from '../../Envs';
import { QuickRLJS } from '../../';
import { EnvOptions } from '../../RLInterface/Environment';
import { RandomAgent } from '../../Agents';

describe('TaxiEnv Random Agent Integration', function () {
    const envOptions: EnvOptions = {
        randomSeed: 123,
    };
    const agentRandomSeed = 15;
    const env: TaxiEnv = <TaxiEnv>QuickRLJS.loadEnv('Taxi', envOptions);
    const agent: RandomAgent = new RandomAgent(env, agentRandomSeed);

    env.agent = agent;
    env.initAgent();

    it('Training Loop', async function () {
        const spyObjectEnv = sinon.spy(env);
        const spyObjectAgent = sinon.spy(agent);

        const trainIteration = 10;
        const logInterval = 4;
        const maxIterGame = 5;

        await env.train(trainIteration, logInterval, maxIterGame);

        assert.strictEqual(spyObjectEnv.step.callCount, 10 * 5);
        assert.strictEqual(spyObjectEnv.reset.callCount, 11);
        assert.strictEqual(spyObjectEnv.log.callCount, 4);
        assert.strictEqual(spyObjectAgent.step.callCount, 10 * 5);
        assert.strictEqual(spyObjectAgent.feed.callCount, 10 * 5);
    });
});
