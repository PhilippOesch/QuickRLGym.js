import {
    Envs,
    Agents,
    EnvOptions,
    QuickRLJS,
    FileStrategy,
    Utils,
} from '../..';
import DummyFileStrategy from './dummies/MockFileStrategy';

let _env: Envs.TaxiEnv;
let _agent: Agents.QLAgent;
let _fileStrategy: FileStrategy;

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

beforeEach(() => {
    _env = QuickRLJS.loadEnv<Envs.TaxiEnv>('Taxi', envOptions)!;
    _agent = new Agents.QLAgent(_env, agentConfig, agentRandomSeed);
    _fileStrategy = new DummyFileStrategy();

    _env.agent = _agent;
    _env.initAgent();
});

test('qTable - has correct dimensions', () => {
    const qTable = _agent.qTable;
    const expectedDim: number[] = [5, 5, 4, 5, 6];

    expect(qTable.dim).toStrictEqual(expectedDim);
});

test('config - config is set correctly', () => {
    expect(_agent.config).toStrictEqual(agentConfig);
});

test('evalStep - action should be the first action at the start', () => {
    const action = _agent.evalStep(_env.state);
    expect(action).toBe('Up');
});

test('step - With random Seed 134 the first action is "Right"', () => {
    const action = _agent.step(_env.state);
    expect(action).toBe('Right');
});

test('feed - single loop', async () => {
    const maxIterationState = 10;

    const agentDecayEpsilonSpy = jest.spyOn(_agent, 'decayEpsilon');

    const prevState = _env.state;
    const nextAction = _agent.step(prevState);
    const { newState, reward } = _env.step(nextAction);
    const gameStateContext = _env.additionalInfo(maxIterationState);
    await _agent.feed(
        prevState,
        nextAction,
        newState,
        reward,
        gameStateContext
    );

    expect(_env.encodeStateToIndices(prevState)).toStrictEqual([0, 0, 2, 1]);
    expect(_env.encodeStateToIndices(newState)).toStrictEqual([1, 0, 2, 1]);
    expect(reward).toBe(-1);
    expect(_agent.qTable.get(0, 0, 2, 1, 3)).toBe(-0.1);
    expect(agentDecayEpsilonSpy).toHaveBeenCalledTimes(0);
});

test('load agent - dummy file strategy empty - throws error', async () => {
    const loadAgent = async () => {
        await _agent.load(_fileStrategy);
    };

    try {
        await loadAgent();
    } catch (e: any) {
        expect(e).toBeInstanceOf(Error);
        expect(e.message).toMatch(
            'object is missing important attributes for conversion'
        );
    }
});

test('load agent - loading after save - throws no error and works correctly', async () => {
    const fileStrategySaveSpy = jest.spyOn(_fileStrategy, 'save');
    const fileStrategyLoadSpy = jest.spyOn(_fileStrategy, 'load');

    const qtableBefore: Utils.Tensor = _agent.qTable;
    await _agent.save(_fileStrategy);
    await _agent.load(_fileStrategy);

    expect(fileStrategySaveSpy).toBeCalledTimes(1);
    expect(fileStrategyLoadSpy).toBeCalledTimes(1);
    expect(_agent.qTable.isEqual(qtableBefore)).toBe(true);
});

test('save config - filestrategy save is called once', async () => {
    const fileStrategySaveSpy = jest.spyOn(_fileStrategy, 'save');
    await _agent.save(_fileStrategy);

    expect(fileStrategySaveSpy).toBeCalledTimes(1);
});

test('load config - works correctly', async () => {
    const fileStrategySaveSpy = jest.spyOn(_fileStrategy, 'save');
    const fileStrategyLoadSpy = jest.spyOn(_fileStrategy, 'load');

    await _agent.saveConfig(_fileStrategy);
    await _agent.loadConfig(_fileStrategy);

    expect(fileStrategySaveSpy).toBeCalledTimes(1);
    expect(fileStrategyLoadSpy).toBeCalledTimes(1);
});
