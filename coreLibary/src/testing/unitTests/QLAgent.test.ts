import { strict as assert } from 'node:assert';
import sinon from 'sinon';
import { describe } from 'mocha';
import { EnvOptions, QuickRLJS } from '../..';
import { TaxiEnv } from '../../Envs';
import { QLAgent } from '../../Agents';

const arrayIsEqual = (array1: number[], array2: number[]): boolean => {
    if (array1.length !== array2.length) {
        return false;
    }

    for (let i = 0; i < array1.length; i++) {
        if (array1[i] !== array2[i]) {
            return false;
        }
    }
    return true;
};

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
        assert.strictEqual(true, arrayIsEqual(expectedDim, qTable.dim));
    });

    it('config', function () {
        assert.strictEqual(agentConfig, agent.config);
    });
});
