import { beforeEach } from 'node:test';
import {
    SingleAgentEnvironment,
    EnvOptions,
    QuickRLJS,
    Agent,
    Agents,
} from '../..';

let _env: SingleAgentEnvironment;
let _agent: Agent;

const envOptions: EnvOptions = {
    randomSeed: 16,
};

const agentRandomSeed: number = 20;

const agentConfig = {
    learningRate: 0.1,
    discountFactor: 0.9,
    epsilonStart: 0.9,
    epsilonDecaySteps: 100,
    epsilonEnd: 0.1,
};

function loadTestEnv(): SingleAgentEnvironment {
    return QuickRLJS.loadEnv<SingleAgentEnvironment>('Taxi', envOptions)!;
}

function loedTestAgent(env: SingleAgentEnvironment): Agent {
    return new Agents.QLAgent(env, agentConfig, agentRandomSeed);
}

test('call training with no agent defined - throws error', async () => {
    _env = loadTestEnv();

    try {
        await _env.train(10);
    } catch (e: any) {
        expect(e).toBeInstanceOf(Error);
        expect(e.message).toMatch('No Agent has been set');
    }
});

test('call training with agent set but not initialized - throws error', async () => {
    _env = loadTestEnv();
    _agent = loedTestAgent(_env);
    _env.agent = _agent;

    try {
        await _env.train(10);
    } catch (e: any) {
        expect(e).toBeInstanceOf(Error);
        expect(e.message).toMatch(
            'The agent has not been initialized for training.'
        );
    }
});

test('call training with agent set and initialized - throws no error', async () => {
    _env = loadTestEnv();
    _agent = loedTestAgent(_env);

    const agentStepSpy = jest.spyOn(_agent, 'step');
    const agentFeedSpy = jest.spyOn(_agent, 'feed');
    const envStepSpy = jest.spyOn(_env, 'step');

    _env.agent = _agent;
    _env.initAgent();

    await _env.train(10, 1, 1);

    expect(agentStepSpy).toBeCalledTimes(10);
    expect(agentFeedSpy).toBeCalledTimes(10);
    expect(envStepSpy).toBeCalledTimes(10);
});

test('call training with agent set and initialized two times - throws no error', async () => {
    _env = loadTestEnv();
    _agent = loedTestAgent(_env);

    const agentStepSpy = jest.spyOn(_agent, 'step');
    const agentFeedSpy = jest.spyOn(_agent, 'feed');
    const envStepSpy = jest.spyOn(_env, 'step');

    _env.agent = _agent;

    _env.initAgent();
    _env.initAgent();

    await _env.train(10, 1, 1);

    expect(agentStepSpy).toBeCalledTimes(10);
    expect(agentFeedSpy).toBeCalledTimes(10);
    expect(envStepSpy).toBeCalledTimes(10);
});
