import Agent from '../../RLInterface/Agent';
import sinon from 'sinon';

describe('Agent', function () {
    class MockAgent extends Agent {
        get config(): object {
            return {};
        }
        init(): void {
            console.log('Agent Initialized');
        }
        step(state: object): string {
            return JSON.stringify(state);
        }
        async feed(
            prevState: object,
            takenAction: string,
            newState: object,
            payoff: number,
            contextInfo: object
        ): Promise<void> {
            if (prevState && takenAction && newState && payoff && contextInfo) {
                console.log('mock agent feed');
            }
        }
        setConfig(
            config?: object | undefined,
            randomSeed?: number | undefined
        ): void {
            if (config && randomSeed) {
                console.log('mock agent config set');
            }
        }
        evalStep(state: object): string {
            return JSON.stringify(state);
        }
        log(): void {}
    }

    const testAgent = new MockAgent({} as any);
    const agentMock = sinon.mock(testAgent);

    it('init', function () {
        const mockMethod = agentMock.expects('init');
        mockMethod.exactly(1);
        testAgent.init();
        mockMethod.verify();
    });

    it('feed', function () {
        const mockMethod = agentMock.expects('feed');
        mockMethod.exactly(1);
        mockMethod.withArgs({ test: 'test' }, 'action', {}, 2, {});
        testAgent.feed({ test: 'test' }, 'action', {}, 2, {});
        mockMethod.verify();
    });

    it('step', function () {
        const mockMethod = agentMock.expects('step');
        mockMethod.exactly(1);
        mockMethod.withArgs({ test: 'test' });
        testAgent.step({ test: 'test' });
        mockMethod.verify();
    });

    it('setConfig', function () {
        const mockMethod = agentMock.expects('setConfig');
        mockMethod.exactly(1);
        mockMethod.withArgs({ test: 'test' }, 14);
        testAgent.setConfig({ test: 'test' }, 14);
        mockMethod.verify();
    });

    it('evalStep', function () {
        const mockMethod = agentMock.expects('evalStep');
        mockMethod.exactly(1);
        mockMethod.withArgs({ y: 5, x: 2 });
        testAgent.evalStep({ y: 5, x: 2 });
        mockMethod.verify();
    });

    it('log', function () {
        const mockMethod = agentMock.expects('log');
        mockMethod.exactly(1);
        testAgent.log();
        mockMethod.verify();
    });
});
