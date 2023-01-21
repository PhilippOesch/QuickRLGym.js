import { Agent, Agents, Environment } from 'quickrl.core';

const agentMapping: Map<string, typeof Agent> = new Map<string, typeof Agent>([
    ['random', Agents.MCAgent],
    ['QLearning', Agents.QLAgent],
    ['MCLearning', Agents.MCAgent],
    ['DQN', Agents.DQNAgent],
]);

export default function useAgent(
    agentName: string,
    env: Environment,
    options: object,
    randomSeed?: number
): Agent {
    const agentType = agentMapping.get(agentName) as any;
    const agent: Agent = new agentType(env) as Agent;
    agent.setOptions(options, randomSeed);
    return agent;
}
