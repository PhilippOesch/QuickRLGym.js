import Agent from '../RLInterface/Agent';
import sinon from 'sinon';

describe('Agent', function () {
    class TestAgent extends Agent {
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

    const testAgent = new TestAgent({} as any);

    it('mock the init method', function () {
        const agentMock = sinon.mock(testAgent).expects('init');
        agentMock.exactly(1);
        testAgent.init();
    });

    it('mock the feed method', function () {
        const agentMock = sinon.mock(testAgent).expects('feed');
        agentMock.exactly(1);
        agentMock.withArgs({ test: 'test' }, 'action', {}, 2, {});
        testAgent.feed({ test: 'test' }, 'action', {}, 2, {});
    });

    it('mock the step method', function () {
        const agentMock = sinon.mock(testAgent).expects('step');
        agentMock.exactly(1);
        agentMock.withArgs({ test: 'test' });
        agentMock.returned('action');
        testAgent.step({ test: 'test' });
    });

    it('mock the stepConfig method', function () {
        const agentMock = sinon.mock(testAgent).expects('setConfig');
        agentMock.exactly(1);
        agentMock.withArgs({ test: 'test' }, 14);
        testAgent.setConfig({ test: 'test' }, 14);
    });

    it('mock the evalStep method', function () {
        const agentMock = sinon.mock(testAgent).expects('evalStep');
        agentMock.exactly(1);
        agentMock.withArgs({ y: 5, x: 2 });
        testAgent.evalStep({ y: 5, x: 2 });
    });
});
