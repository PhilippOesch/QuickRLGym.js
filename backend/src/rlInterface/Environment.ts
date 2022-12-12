import { Game } from '../../../shared/src';
import Agent from './Agent';
import { StepResult } from '../../../shared/src';

abstract class SingleAgentEnvironment {
    //protected game: Game;
    protected agent?: Agent;
    protected initialState?: object;

    constructor(initialState?: object) {
        this.initialState = initialState;
    }

    public set setAgent(agent: Agent) {
        this.agent = agent;
    }

    public abstract initEnv(): void;

    public train(
        iterations: number = 100,
        logEvery = 10,
        maxIterationPerGame: number = 100
    ): void {
        this.reset();

        if (this.agent == undefined) {
            throw new Error('No Agent has been set');
        }

        let averageGameIterations = 0;
        let count = 0;
        for (let i = 0; i < iterations; i++) {
            while (
                !this.getIsTerminal &&
                this.getIteration < maxIterationPerGame
            ) {
                const prevState: object = this.getState;
                const nextAction: string = this.agent.step(this.getState);
                const { newState, reward } = this.step(nextAction);
                this.agent.feed(prevState, nextAction, newState, reward);
            }
            count++;
            averageGameIterations += this.getIteration;
            if (i % logEvery == 0) {
                console.log(
                    'averageGameIterations:',
                    averageGameIterations / count
                );
                console.log('Iteration:', i);
                this.agent.log();
                averageGameIterations = 0;
                count = 0;
            }
            const isReset = this.reset();
            if (!isReset) {
                break;
            }
        }
    }

    public abstract step(action: string): StepResult;

    public abstract get getReward(): number;

    public abstract get getState(): object;

    public abstract reset(): boolean;

    public abstract get getIsTerminal(): boolean;

    public abstract get getIteration(): number;

    public abstract encodeStateToIndices(state: object): number[];
}

export default SingleAgentEnvironment;
