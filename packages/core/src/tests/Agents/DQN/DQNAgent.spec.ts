import { Agents, Envs, EnvOptions, QuickRLJS } from '../../..';
import DummyFileStrategy from '../dummies/MockFileStrategy';

let _env: Envs.TaxiEnv;
let _agent: Agents.DQNAgent;
let _fileStrategy: DummyFileStrategy<any>;

const envOptions: EnvOptions = {
    randomSeed: 134,
};

const agentRandomSeed = 135;

const agentConfig: Agents.DQNAgentSettings = {
    learningRate: 0.001,
    discountFactor: 0.5,
    nnLayer: [16, 16],
    replayMemorySize: 10,
    batchSize: 32,
    replayMemoryInitSize: 5,
    epsilonStart: 1,
    epsilonEnd: 0.1,
    epsilonDecaySteps: 50,
    activateDoubleDQN: true,
    updateTargetEvery: 5,
};

beforeEach(() => {
    _env = QuickRLJS.loadEnv<Envs.TaxiEnv>('Taxi', envOptions)!;
    _agent = new Agents.DQNAgent(_env, agentConfig, agentRandomSeed);
    _fileStrategy = new DummyFileStrategy();
});

test('initialization', () => {
    const agentCreateNetworkSpy = jest.spyOn(_agent, 'createNetwork');

    _agent.init();

    expect(agentCreateNetworkSpy).toBeCalledTimes(2);
});

test('config is returned after beeing set', () => {
    _agent.setConfig(agentConfig, agentRandomSeed);

    expect(_agent.config).toBe(agentConfig);
});

test('step - evalStep is not called on this random seed on the first call', () => {
    const evalStepSpy = jest.spyOn(_agent, 'evalStep');

    _agent.init();

    const prevState = _env.state;
    _agent.step(prevState);

    expect(evalStepSpy).toBeCalledTimes(0);
});

test('initialize Normal DQN - no target network defined', () => {
    const agentConfig: Agents.DQNAgentSettings = {
        learningRate: 0.001,
        discountFactor: 0.5,
        nnLayer: [16, 16],
        replayMemorySize: 10,
        batchSize: 32,
        replayMemoryInitSize: 5,
        epsilonStart: 1,
        epsilonEnd: 0.1,
        epsilonDecaySteps: 50,
        activateDoubleDQN: false,
        updateTargetEvery: 6,
    };

    _agent.setConfig(agentConfig);
    _agent.init();

    expect(_agent.network.local).not.toBeUndefined();
    expect(_agent.network.target).toBeUndefined();
});

test('initialize Double DQN - target network defined', () => {
    const agentConfig: Agents.DQNAgentSettings = {
        learningRate: 0.001,
        discountFactor: 0.5,
        nnLayer: [16, 16],
        replayMemorySize: 10,
        batchSize: 32,
        replayMemoryInitSize: 5,
        epsilonStart: 1,
        epsilonEnd: 0.1,
        epsilonDecaySteps: 50,
        activateDoubleDQN: true,
        updateTargetEvery: 6,
    };

    _agent.setConfig(agentConfig);
    _agent.init();

    expect(_agent.network.local).not.toBeUndefined();
    expect(_agent.network.target).not.toBeUndefined();
});

test('feed', async () => {
    _agent.init();

    const replayMemorySaveSpy = jest.spyOn(_agent.replayMemory, 'save');
    const agentFeedSpy = jest.spyOn(_agent, 'feed');

    const prevState = _env.state;
    const action = _agent.step(prevState);
    const { newState, reward } = _env.step(<any>action);
    const gameState = _env.additionalInfo();

    await _agent.feed(prevState, action, newState, reward, gameState);

    expect(replayMemorySaveSpy).toBeCalledTimes(1);
    expect(agentFeedSpy).toBeCalledTimes(1);
});

test('save agent - file strategy save is called', async () => {
    const fileStrategySaveSpy = jest.spyOn(_fileStrategy, 'save');
    _agent.init();

    await _agent.save(_fileStrategy);

    expect(fileStrategySaveSpy).toBeCalledTimes(1);
});

test('load agent - no reference is set - should throw', async () => {
    _agent.init();

    const loadAgent = async () => {
        await _agent.load(_fileStrategy);
    };

    try {
        await loadAgent();
    } catch (e: any) {
        expect(e).toBeInstanceOf(Error);
        expect(e.message).toMatch(
            "Cannot read properties of undefined (reading 'compile')"
        );
    }
});

test('load agent - In Double DQN file strategy save should be called twice', async () => {
    const fileStrategySaveSpy = jest.spyOn(_fileStrategy, 'save');
    const fileStrategyLoadSpy = jest.spyOn(_fileStrategy, 'load');

    _agent.init();

    await _agent.save(_fileStrategy);
    await _agent.load(_fileStrategy);

    expect(fileStrategySaveSpy).toBeCalledTimes(1);

    // because for loading a double dqn the load is called twice once for each network
    expect(fileStrategyLoadSpy).toBeCalledTimes(2);
});

test('save config - save of file strategy is called', async () => {
    const fileStrategySaveSpy = jest.spyOn(_fileStrategy, 'save');

    _agent.init();

    await _agent.saveConfig(_fileStrategy);

    expect(fileStrategySaveSpy).toBeCalledTimes(1);
});

test('save config - save of file strategy is called', async () => {
    const fileStrategySaveSpy = jest.spyOn(_fileStrategy, 'save');
    const fileStrategyLoadSpy = jest.spyOn(_fileStrategy, 'load');

    _agent.init();

    await _agent.saveConfig(_fileStrategy);
    await _agent.loadConfig(_fileStrategy);

    expect(fileStrategySaveSpy).toBeCalledTimes(1);
    expect(fileStrategyLoadSpy).toBeCalledTimes(1);
});
