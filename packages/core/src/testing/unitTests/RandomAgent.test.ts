import { strict as assert } from 'node:assert';
import { describe } from 'mocha';
import { Agents } from '../../index';
import sinon from 'sinon';

describe('RandomAgent', function () {
    const randomSeed = 15;

    const envMock = {
        actionSpace: ['a', 'b', 'c'],
    };

    const mockAgent = new Agents.RandomAgent(envMock as any, randomSeed);

    it('config', function () {
        const config = <any>mockAgent.config;

        assert.strictEqual(config.randomSeed, randomSeed.toString());
    });

    it('setConfig', function () {
        const newRandomSeed = 20;
        mockAgent.setConfig(undefined, newRandomSeed);

        const config = <any>mockAgent.config;
        assert.strictEqual(config.randomSeed, newRandomSeed.toString());

        //reset random seed
        mockAgent.setConfig(undefined, randomSeed);
    });

    it('init', function () {
        const localMockAgent = new Agents.RandomAgent(<any>envMock);

        const spyInit = sinon.spy(localMockAgent, 'init');
        localMockAgent.init();
        assert.strictEqual(spyInit.callCount, 1);
    });

    it('step', function () {
        const spyStep = sinon.spy(mockAgent, 'step');

        const expectedActionOrder = ['a', 'c', 'b'];

        const results = [mockAgent.step(), mockAgent.step(), mockAgent.step()];

        assert.strictEqual(expectedActionOrder[0], results[0]);
        assert.strictEqual(expectedActionOrder[1], results[1]);
        assert.strictEqual(expectedActionOrder[2], results[2]);
        assert.strictEqual(spyStep.callCount, 3);
    });

    it('feed', function () {
        const spyFeed = sinon.spy(mockAgent, 'feed');
        mockAgent.feed();
        assert.strictEqual(spyFeed.callCount, 1);
    });

    it('log', function () {
        const spyLog = sinon.spy(mockAgent, 'log');
        mockAgent.log();
        assert.strictEqual(spyLog.callCount, 1);
    });

    it('evalStep', function () {
        const spyEvalStep = sinon.spy(mockAgent, 'evalStep');

        const expectedActionOrder = ['b', 'a', 'a'];

        const results = [
            mockAgent.evalStep(),
            mockAgent.evalStep(),
            mockAgent.evalStep(),
        ];

        assert.strictEqual(expectedActionOrder[0], results[0]);
        assert.strictEqual(expectedActionOrder[1], results[1]);
        assert.strictEqual(expectedActionOrder[2], results[2]);
        assert.strictEqual(spyEvalStep.callCount, 3);
    });
});
