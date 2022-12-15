import { SingleAgentEnvironment, StepResult } from '../index';

export default class BlackJackEnv extends SingleAgentEnvironment {
    public initEnv(): void {
        throw new Error('Method not implemented.');
    }
    public step(action: string): StepResult {
        throw new Error('Method not implemented.');
    }
    public get getReward(): number {
        throw new Error('Method not implemented.');
    }
    public get getState(): object {
        throw new Error('Method not implemented.');
    }
    public reset(): boolean {
        throw new Error('Method not implemented.');
    }
    public get getIsTerminal(): boolean {
        throw new Error('Method not implemented.');
    }
    public get getIteration(): number {
        throw new Error('Method not implemented.');
    }
    public encodeStateToIndices(state: object): number[] {
        throw new Error('Method not implemented.');
    }
}
