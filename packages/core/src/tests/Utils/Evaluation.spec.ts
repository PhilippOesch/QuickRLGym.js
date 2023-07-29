import { EnvOptions, Envs, Agents, QuickRLJS, Utils } from '../..';

test('Evaluate Random Agent in Taxi Environment - returns correct stats and method call counts', () => {
    const envOptions: EnvOptions = {
        randomSeed: 123,
    };
    const agentRandomSeed = 15;
    const env: Envs.TaxiEnv = <Envs.TaxiEnv>(
        QuickRLJS.loadEnv('Taxi', envOptions)
    );
    const agent: Agents.RandomAgent = new Agents.RandomAgent(
        env,
        agentRandomSeed
    );
    agent.init();

    const stepEnvFncSpy = jest.spyOn(env, 'step');
    const onIterationEndEnvFncSpy = jest.spyOn(env, 'onIterationEnd');
    const resetEnvFncSpy = jest.spyOn(env, 'reset');
    const evalStepAgentFncSpy = jest.spyOn(agent, 'evalStep');

    const stats: Envs.TaxiStats = <Envs.TaxiStats>(
        Utils.Evaluation.benchmarkSingleAgent(env, agent, 10, 20, 10)
    );

    expect(stats.avgGameIterations).toStrictEqual(10);
    expect(stats.avgGameScore).toStrictEqual(-35.2);
    expect(stepEnvFncSpy).toBeCalledTimes(100);
    expect(onIterationEndEnvFncSpy).toBeCalledTimes(10);
    expect(resetEnvFncSpy).toBeCalledTimes(11);
    expect(evalStepAgentFncSpy).toBeCalledTimes(100);
});

test('Evaluate Random Agent in BlackJack Environment - returns correct stats and method call counts', () => {
    const envOptions: EnvOptions = {
        randomSeed: 123,
    };
    const agentRandomSeed = 15;
    const env: Envs.BlackJackEnv = <Envs.BlackJackEnv>(
        QuickRLJS.loadEnv('BlackJack', envOptions)
    );
    const agent: Agents.RandomAgent = new Agents.RandomAgent(
        env,
        agentRandomSeed
    );
    agent.init();

    const stepEnvFncSpy = jest.spyOn(env, 'step');
    const onIterationEndEnvFncSpy = jest.spyOn(env, 'onIterationEnd');
    const resetEnvFncSpy = jest.spyOn(env, 'reset');
    const evalStepAgentFncSpy = jest.spyOn(agent, 'evalStep');

    const stats: Envs.BlackJackStats = <Envs.BlackJackStats>(
        Utils.Evaluation.benchmarkSingleAgent(env, agent, 10, 20, 10)
    );

    expect(stats.averageReturn).toStrictEqual(0.2);
    expect(stats.averageDealerScore).toStrictEqual(20.6);
    expect(stats.averagePlayerScore).toStrictEqual(16.8);
    expect(stepEnvFncSpy).toBeCalledTimes(14);
    expect(onIterationEndEnvFncSpy).toBeCalledTimes(10);
    expect(resetEnvFncSpy).toBeCalledTimes(11);
    expect(evalStepAgentFncSpy).toBeCalledTimes(14);
});
