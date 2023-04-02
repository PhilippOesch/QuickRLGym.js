import { strict as assert } from 'node:assert';
import { describe } from 'mocha';
import { MCAgent, MCAgentSettings } from '../../Agents';
import { EnvOptions } from '../../RLInterface/Environment';
import { BlackJackEnv } from '../../Envs';
import { QuickRLJS } from '../../RLInterface/QuickRLJS';
import sinon from 'sinon';

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
        const gameStateContext = {
            isTerminal: false,
            maxIterationReached: false,
        };
        await agent.feed(
            prevState,
            action,
            stepResult.newState,
            stepResult.reward,
            gameStateContext
        );

        assert.strictEqual(1, spy.step.callCount);
        assert.strictEqual(1, spy.feed.callCount);
        assert.strictEqual(1, agent.experience.length);
    });
});
