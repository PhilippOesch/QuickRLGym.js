import seedrandom from 'seedrandom';
import { Agents, Games, Utils, Envs, EnvOptions, QuickRLJS } from '../../..';

const replayMemorySize = 10;
const sampleRandomSeed: number = 15;
const envOptions: EnvOptions = {
    randomSeed: 134,
};

let _replayMemory: Agents.ReplayMemory;
let _env: Envs.TaxiEnv;
let prevState: Games.Taxi.TaxiGameState;

function generateAndSaveTestData(
    replayMemory: Agents.ReplayMemory,
    amount: number
): void {
    for (let i = 1; i <= amount; i++) {
        let newState = {
            playerPos: new Utils.Vec2(i, i),
            destinationIdx: i,
            customerPosIdx: i,
        };

        replayMemory.save({
            prevState: _env.encodeStateToIndices(prevState),
            takenAction: i,
            newState: _env.encodeStateToIndices(newState),
            payoff: i,
            contextInfo: {
                isTerminal: false,
                maxIterationReached: false,
            },
        });

        prevState = newState;
    }
}

beforeEach(() => {
    _replayMemory = new Agents.ReplayMemory(replayMemorySize);
    _env = QuickRLJS.loadEnv<Envs.TaxiEnv>('Taxi', envOptions)!;
    prevState = {
        playerPos: new Utils.Vec2(0, 0),
        destinationIdx: 0,
        customerPosIdx: 0,
    };
});

test('state after initialization is correct', () => {
    expect(_replayMemory.size).toBe(0);
    expect(_replayMemory.maxSize).toBe(replayMemorySize);
});

test('has correct size after adding entries', () => {
    const testAmounts = [9, 10, 15];
    const expectedSizes = [9, 10, 10];

    for (let i = 0; i < testAmounts.length; i++) {
        _replayMemory = new Agents.ReplayMemory(replayMemorySize);
        generateAndSaveTestData(_replayMemory, testAmounts[i]);
        expect(_replayMemory.size).toBe(expectedSizes[i]);
    }
});

test('sample - returns exact number of samples and the correct samples', () => {
    generateAndSaveTestData(_replayMemory, 10);
    const samples = _replayMemory.sample(
        4,
        seedrandom(sampleRandomSeed.toString())
    );

    expect(samples.stateBatch.length).toBe(4);
    expect(samples.actionBatch.length).toBe(4);
    expect(samples.newStateBatch.length).toBe(4);
    expect(samples.payoffBatch.length).toBe(4);
    expect(samples.contextInfoBatch.length).toBe(4);

    expect(samples.payoffBatch[0]).toBe(2);
    expect(samples.payoffBatch[1]).toBe(10);
    expect(samples.payoffBatch[2]).toBe(8);
    expect(samples.payoffBatch[3]).toBe(3);
});

test('on memory size exceding - entry with payoff of 10 is dropped', () => {
    generateAndSaveTestData(_replayMemory, 10);

    _replayMemory.save({
        prevState: _env.encodeStateToIndices(prevState),
        takenAction: 11,
        newState: _env.encodeStateToIndices(prevState),
        payoff: 11,
        contextInfo: {
            isTerminal: false,
            maxIterationReached: false,
        },
    });

    const samples = _replayMemory.sample(
        10,
        seedrandom(sampleRandomSeed.toString())
    );

    const found = samples.payoffBatch.find((payoff: number) => payoff == 1);

    expect(found).toBeUndefined();
});
