import MCAgent, { MCAgentSettings } from './MCAgent/MCAgent';
import QLAgent, { QLAgentSettings } from './QLAgent/QLAgent';
import DQNAgent, { DQNAgentSettings } from './DQNAgent/DQNAgent';
import RandomAgent from './randomAgent/RandomAgent';

export {
    MCAgent,
    QLAgent,
    RandomAgent,
    DQNAgent,
    type DQNAgentSettings,
    type MCAgentSettings,
    type QLAgentSettings,
};
