import Agent from '../RLInterface/Agent';
import { SingleAgentEnvironment } from '../RLInterface/SingleAgentEnvironment';

// expects an initialized Environment with agent
export function benchmarkSingleAgent(
    env: SingleAgentEnvironment,
    agent: Agent,
    iterations: number,
    randomSeed: number,
    maxIteration: number = 100
): object {
    env.resetStats();
    env.setOptions({
        randomSeed: randomSeed,
    });

    env.agent = agent;

    env.reset();
    for (let i = 0; i < iterations; i++) {
        while (
            (!env.isTerminal && env.iteration < maxIteration) ||
            (!env.isTerminal && maxIteration == -1)
        ) {
            const prevState: object = env.state;
            const nextAction: string = agent.evalStep(prevState);
            env.step(nextAction);
        }
        env.onIterationEnd();
        env.reset();
    }

    return env.stats;
}
