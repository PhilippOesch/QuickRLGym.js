import sinon from 'sinon';
import Environment, { EnvOptions } from '../RLInterface/Environment';
import StepResult from '../RLInterface/StepResult';

describe('Environment', function () {
    class MockEnvironment extends Environment {
        private _iteration: number = 0;

        get stateDim(): number[] {
            return [];
        }
        get actionSpace(): string[] {
            return ['action'];
        }
        get state(): object {
            return {};
        }
        get isTerminal(): boolean {
            return true;
        }
        get iteration(): number {
            return this._iteration;
        }
        get stats(): object {
            return {};
        }
        get name(): string {
            return 'Name';
        }
        init(
            options?: EnvOptions | undefined,
            initialState?: object | undefined
        ): void {
            return;
        }
        step(action: string): StepResult {
            this._iteration++;
            return {
                newState: { x: 1, y: 2 },
                reward: 10,
            };
        }
        reset(): boolean {
            return true;
        }
        setOptions(options?: EnvOptions | undefined): void {
            return;
        }
        encodeStateToIndices(state: object): number[] {
            return [1];
        }
        resetStats(): boolean {
            return true;
        }
    }

    const testEnvironment = new MockEnvironment();
    const envMock = sinon.mock(testEnvironment);

    it('init', function () {
        const mockeMethod = envMock.expects('init');
        mockeMethod.exactly(1);
        testEnvironment.init();
        mockeMethod.verify();
    });

    it('step', function () {
        const mockeMethod = envMock.expects('step');
        mockeMethod.exactly(1);
        mockeMethod.withArgs('action');
        mockeMethod.returned({
            newState: { x: 1, y: 2 },
            reward: 10,
        });
        testEnvironment.step('action');
        mockeMethod.verify();
    });

    it('reset', function () {
        const mockMethod = envMock.expects('reset');
        mockMethod.exactly(1);
        mockMethod.alwaysReturned(true);
        testEnvironment.reset();
        mockMethod.verify();
    });

    it('setOptions', function () {
        const mockMethod = envMock.expects('setOptions');
        mockMethod.exactly(1);
        mockMethod.withArgs({ randomSeed: 12 });
        testEnvironment.setOptions({ randomSeed: 12 });
        mockMethod.verify();
    });

    it('encodeStateToIndices', function () {
        const mockMethod = envMock.expects('encodeStateToIndices');
        mockMethod.exactly(1);
        mockMethod.withArgs({});
        mockMethod.returned([1]);
        testEnvironment.encodeStateToIndices({});
        mockMethod.verify();
    });

    it('encodeStateToIndices', function () {
        const mockMethod = envMock.expects('resetStats');
        mockMethod.exactly(1);
        mockMethod.returned(true);
        testEnvironment.resetStats();
        mockMethod.verify();
    });
});
