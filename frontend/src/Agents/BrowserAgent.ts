import GameState from "../../../shared/game/GameState";

export default abstract class BrowserAgent {
    protected actionSpace: string[];

    constructor(actionSpace: string[]) {
        this.actionSpace = actionSpace;
    }

    public abstract load(): Promise<void>;

    public abstract evalStep(state: GameState): string;
}
