import { Agents, Envs, EnvOptions, QuickRLJS, FileStrategy } from '../..';
import DummyFileStrategy from './dummies/MockFileStrategy';

let _env: Envs.BlackJackEnv;
let _agent: Agents.MCAgent;
let _fileStrategy: FileStrategy;

const envOptions: EnvOptions = {
    randomSeed: 135,
};
const agentRandomSeed = 134;

const agentConfig: Agents.MCAgentSettings = {
    epsilonStart: 0.9,
    epsilonDecaySteps: 100,
    epsilonEnd: 0.1,
    discountFactor: 0.9,
};

beforeEach(() => {
    _env = <Envs.BlackJackEnv>QuickRLJS.loadEnv('BlackJack', envOptions);
    _agent = new Agents.MCAgent(_env, agentConfig, agentRandomSeed);
    _fileStrategy = new DummyFileStrategy();

    _env.agent = _agent;
    _env.initAgent();
});

test('agent config is equal to defined config', () => {
    expect(_agent.config).toStrictEqual(agentConfig);
});

test('initial value Table has correct sum, mean and dimension', () => {
    const valueTable = _agent.valueTable;

    expect(valueTable.dim).toStrictEqual([32, 11, 2, 2]);
    expect(valueTable.sum).toBe(0);
    expect(valueTable.mean).toBe(0);
});

test('initial stateReturnCountTable has correct sum, mean and dimension', () => {
    const stateReturnCountTable = _agent.stateReturnCountTable;

    expect(stateReturnCountTable.dim).toStrictEqual([32, 11, 2, 2]);
    expect(stateReturnCountTable.sum).toBe(0);
    expect(stateReturnCountTable.mean).toBe(0);
});

test('evalStep - expected action is "Stick"', () => {
    expect(_agent.evalStep(_env.state)).toBe('Stick');
});

test('step - expected action with random seed 135 is "Stick"', () => {
    expect(_agent.step(_env.state)).toBe('Stick');
});

test('feed', async () => {
    const agentStepSpy = jest.spyOn(_agent, 'step');
    const agentFeedSpy = jest.spyOn(_agent, 'feed');

    const prevState = _env.state;
    const action = _agent.step(_env.state);
    const stepResult = _env.step(action);

    // manipulate the game state context for testing.
    const envStateContext = {
        isTerminal: false,
        maxIterationReached: false,
    };
    await _agent.feed(
        prevState,
        action,
        stepResult.newState,
        stepResult.reward,
        envStateContext
    );

    expect(agentStepSpy).toBeCalledTimes(1);
    expect(agentFeedSpy).toBeCalledTimes(1);
    expect(_agent.experience.length).toBe(1);
});

test('decayStep - decayEpsilon is called', async () => {
    const agentDecayEpsilonSpy = jest.spyOn(_agent, 'decayEpsilon');

    const prevState = _env.state;
    const action = _agent.step(_env.state);
    const stepResult = _env.step(action);
    const envStateContext = _env.additionalInfo();

    await _agent.feed(
        prevState,
        action,
        stepResult.newState,
        stepResult.reward,
        envStateContext
    );

    expect(agentDecayEpsilonSpy).toBeCalledTimes(1);
});

test('load without saving - throws error', async () => {
    const loadAgent = async () => {
        await _agent.load(_fileStrategy);
    };

    try {
        await loadAgent();
    } catch (e: any) {
        expect(e).toBeInstanceOf(Error);
        expect(e.message).toMatch(
            "Cannot read properties of undefined (reading 'dim')"
        );
    }
});

test('load works after saving', async () => {
    const fileStrategyLoadSpy = jest.spyOn(_fileStrategy, 'load');
    const fileStrategySaveSpy = jest.spyOn(_fileStrategy, 'save');

    const valueTableBefore = _agent.valueTable.copy();
    const stateReturnCountTableBefore = _agent.stateReturnCountTable.copy();

    await _agent.save(_fileStrategy);
    await _agent.load(_fileStrategy);

    expect(fileStrategyLoadSpy).toBeCalledTimes(1);
    expect(fileStrategySaveSpy).toBeCalledTimes(1);
    expect(valueTableBefore.isEqual(_agent.valueTable)).toBe(true);
    expect(
        stateReturnCountTableBefore.isEqual(_agent.stateReturnCountTable)
    ).toBe(true);
});
