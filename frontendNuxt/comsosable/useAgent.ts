import { Agent, Agents, Environment } from 'quickrl.core';

export interface AgentMappingEntry {
    agentType: typeof Agent;
    usesTensorflow: boolean;
}

export const agentMapping: Map<string, AgentMappingEntry> = new Map<
    string,
    AgentMappingEntry
>([
    ['random', { agentType: Agents.RandomAgent, usesTensorflow: false }],
    ['QLearning', { agentType: Agents.QLAgent, usesTensorflow: false }],
    ['MCLearning', { agentType: Agents.MCAgent, usesTensorflow: false }],
    ['DQN', { agentType: Agents.DQNAgent, usesTensorflow: true }],
]);

export default function useAgent(
    agentName: string,
    env: Environment,
    options?: object,
    randomSeed?: number
): Agent {
    const agentType = agentMapping.get(agentName) as any;
    const agent: Agent = new agentType.agentType(env) as Agent;
    agent.setConfig(options, randomSeed);
    agent.init();
    console.log('new Agent loaded');
    return agent;
}
