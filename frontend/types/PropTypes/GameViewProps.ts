import { Agent } from 'quickrl.core';

interface GameViewProps {
    id: string;
    maxGameIteration: number;
    renderBetweenMoves?: number;
    agent?: Agent;
}

export default GameViewProps;
