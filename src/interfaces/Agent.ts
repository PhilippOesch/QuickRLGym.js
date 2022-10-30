export default abstract class Agent {
    protected actionSpace: string[];
    protected reward: number = 0;

    constructor(actionSpace: string[]) {
        this.actionSpace = actionSpace;
    }

    abstract init(): void;

    abstract step(): string;

    abstract eval_step(): string;
}
