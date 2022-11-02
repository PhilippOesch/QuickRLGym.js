import GameState from "./GameState";

export default abstract class Agent {
    protected actionSpace: string[];

    constructor(actionSpace: string[]) {
        this.actionSpace = actionSpace;
    }

    public get getActionSpace(): string[] {
        return this.actionSpace;
    }

    abstract init(): void;

    abstract step(state: GameState): string;

    abstract eval_step(state: GameState): string;
}
