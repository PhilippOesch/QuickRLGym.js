import { Agents, Envs, QuickRLJS, EnvOptions } from '../..';

test('Taxi Environment training - methods are called the correct amount of times', async () => {
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

    const stepEnvFncSpy = jest.spyOn(env, 'step');
    const resetEnvFncSpy = jest.spyOn(env, 'reset');
    const logEnvFncSpy = jest.spyOn(env, 'log');
    const stepAgentFncSpy = jest.spyOn(agent, 'step');
    const feedAgentFncSpy = jest.spyOn(agent, 'feed');

    env.agent = agent;
    env.initAgent();

    const trainIteration = 10;
    const logInterval = 4;
    const maxIterGame = 5;

    await env.train(trainIteration, logInterval, maxIterGame);

    expect(stepEnvFncSpy).toBeCalledTimes(50);
    expect(resetEnvFncSpy).toBeCalledTimes(11);
    expect(logEnvFncSpy).toBeCalledTimes(4);
    expect(stepAgentFncSpy).toBeCalledTimes(50);
    expect(feedAgentFncSpy).toBeCalledTimes(50);
});

test('BlackJack Environment training - methods are called the correct amount of times', async () => {
    const envOptions: EnvOptions = {
        randomSeed: 124,
    };
    const agentRandomSeed = 17;
    const env: Envs.BlackJackEnv = <Envs.BlackJackEnv>(
        QuickRLJS.loadEnv('BlackJack', envOptions)
    );
    const agent: Agents.RandomAgent = new Agents.RandomAgent(
        env,
        agentRandomSeed
    );

    env.agent = agent;
    env.initAgent();

    const trainIteration = 10;
    const logInterval = 4;
    const maxIterGame = -1;

    const stepEnvFncSpy = jest.spyOn(env, 'step');
    const resetEnvFncSpy = jest.spyOn(env, 'reset');
    const logEnvFncSpy = jest.spyOn(env, 'log');
    const stepAgentFncSpy = jest.spyOn(agent, 'step');
    const feedAgentFncSpy = jest.spyOn(agent, 'feed');

    await env.train(trainIteration, logInterval, maxIterGame);

    expect(stepEnvFncSpy).toBeCalledTimes(15);
    expect(resetEnvFncSpy).toBeCalledTimes(11);
    expect(logEnvFncSpy).toBeCalledTimes(4);
    expect(stepAgentFncSpy).toBeCalledTimes(15);
    expect(feedAgentFncSpy).toBeCalledTimes(15);
});
