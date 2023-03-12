import { strict as assert } from 'node:assert';
import sinon from 'sinon';
import { describe } from 'mocha';
import { MCAgent, MCAgentSettings } from '../../Agents';
import { EnvOptions } from '../../RLInterface/Environment';
import { BlackJackEnv } from '../../Envs';
import { QuickRLJS } from '../../RLInterface/QuickRLJS';

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
});
