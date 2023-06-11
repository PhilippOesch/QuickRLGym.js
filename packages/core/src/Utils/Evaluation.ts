import Agent from '../RLInterface/Agent';
import { SingleAgentEnvironment } from '../RLInterface/SingleAgentEnvironment';

/**
 * Module for Evaluations
 * @module Utils/Evaluation
 * @category Utils
 */

/**
 * Benchmark a single agent
 * @param {SingleAgentEnvironment} env The environment to benchmark in
 * @param {Agent} agent The agent to bechmark. The agent has to be initialized
 * @param {number} iterations The number of iterations
 * @param {number} randomSeed The random seed
 * @param {number} maxIteration The maximum number of game iterations
 * @param {boolean} resetEnvStats Whether to reset the stats of the environment
 * @returns {object} The bechmark result
 */
export function benchmarkSingleAgent(
    env: SingleAgentEnvironment,
    agent: Agent,
    iterations: number,
    randomSeed: number,
    maxIteration: number = 100,
    resetEnvStats: boolean = true
): object {
    if (resetEnvStats) {
        env.resetStats();
    }
    if (env.options?.randomSeed !== randomSeed) {
        env.setOptions({
            randomSeed: randomSeed,
        });
    }

    env.agent = agent;

    env.reset();
    for (let i = 0; i < iterations; i++) {
        while (
            (!env.isTerminal && env.iteration < maxIteration) ||
            (!env.isTerminal && maxIteration === -1)
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
