import { strict as assert } from 'node:assert';
import sinon from 'sinon';
import { describe } from 'mocha';
import { EnvOptions, QuickRLJS } from '../..';
import { BlackJackEnv } from '../../Envs';
import { RandomAgent } from '../../Agents';

describe('BlackJackEnv Random Agent Integration', function () {
    const envOptions: EnvOptions = {
        randomSeed: 124,
    };
    const agentRandomSeed = 17;
    const env: BlackJackEnv = <BlackJackEnv>(
        QuickRLJS.loadEnv('BlackJack', envOptions)
    );
    const agent: RandomAgent = new RandomAgent(env, agentRandomSeed);

    env.agent = agent;
    env.initAgent();

    it('Training Loop', async function () {
        const spyObject = sinon.spy(env);
        const spyObjectAgent = sinon.spy(agent);

        const trainIteration = 10;
        const logInterval = 4;
        const maxIterGame = -1;

        await env.train(trainIteration, logInterval, maxIterGame);

        assert.strictEqual(spyObject.step.callCount, 15);
        assert.strictEqual(spyObject.reset.callCount, 11);
        assert.strictEqual(spyObject.log.callCount, 4);
        assert.strictEqual(spyObjectAgent.step.callCount, 15);
        assert.strictEqual(spyObjectAgent.feed.callCount, 15);
    });
});
