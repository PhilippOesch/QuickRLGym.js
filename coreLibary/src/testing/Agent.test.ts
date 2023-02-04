import Agent from '../RLInterface/Agent';
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
            return 'action';
        }
        async feed(
            prevState: object,
            takenAction: string,
            newState: object,
            payoff: number,
            contextInfo: object
        ): Promise<void> {}
        setConfig(
            config?: object | undefined,
            randomSeed?: number | undefined
        ): void {}
        evalStep(state: object): string {
            return 'evalAction';
        }
        log(): void {}
    }

    const testAgent = new MockAgent({} as any);

    it('init method', function () {
        const agentMock = sinon.mock(testAgent).expects('init');
        agentMock.exactly(1);
        testAgent.init();
    });

    it('feed method', function () {
        const agentMock = sinon.mock(testAgent).expects('feed');
        agentMock.exactly(1);
        agentMock.withArgs({ test: 'test' }, 'action', {}, 2, {});
        testAgent.feed({ test: 'test' }, 'action', {}, 2, {});
    });

    it('step method', function () {
        const agentMock = sinon.mock(testAgent).expects('step');
        agentMock.exactly(1);
        agentMock.withArgs({ test: 'test' });
        agentMock.returned('action');
        testAgent.step({ test: 'test' });
    });

    it('setConfig method', function () {
        const agentMock = sinon.mock(testAgent).expects('setConfig');
        agentMock.exactly(1);
        agentMock.withArgs({ test: 'test' }, 14);
        testAgent.setConfig({ test: 'test' }, 14);
    });

    it('evalStep method', function () {
        const agentMock = sinon.mock(testAgent).expects('evalStep');
        agentMock.exactly(1);
        agentMock.withArgs({ y: 5, x: 2 });
        testAgent.evalStep({ y: 5, x: 2 });
    });

    it('log method', function () {
        const agentMock = sinon.mock(testAgent).expects('log');
        agentMock.exactly(1);
        testAgent.log();
    });
});
