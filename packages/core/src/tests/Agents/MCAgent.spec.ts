import { Agents, Envs, EnvOptions, QuickRLJS } from '../..';

let _env: Envs.BlackJackEnv;
let _agent: Agents.MCAgent;

const envOptions: EnvOptions = {
    randomSeed: 135,
};
const agentRandomSeed = 134;

const agentConfig: Agents.MCAgentSettings = {
    epsilonStart: 0.9,
    epsilonDecaySteps: 100,
    epsilonEnd: 0.1,
    discountFactor: 0.9,
};

beforeEach(() => {
    _env = <Envs.BlackJackEnv>QuickRLJS.loadEnv('BlackJack', envOptions);
    _agent = new Agents.MCAgent(_env, agentConfig, agentRandomSeed);

    _env.agent = _agent;
    _env.initAgent();
});

test('agent config is equal to defined config', () => {
    expect(_agent.config).toStrictEqual(agentConfig);
});
