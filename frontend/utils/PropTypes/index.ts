import { Agent } from 'quickrl.core';
import { InputStyleType } from '../enums';

export interface GameViewProps {
    id: string;
    maxGameIteration: number;
    renderBetweenMoves?: number;
    agent?: Agent;
}

export interface BaseInputProps {
    name: string;
    inputStyle?: InputStyleType;
    styleClasses?: string;
    disabled?: boolean;
    title: string;
}
