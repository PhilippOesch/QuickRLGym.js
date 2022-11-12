import { Game, Utils, Tensor } from "../../../shared/src";
import BrowserAgent from "./BrowserAgent";

export default class QLAgent extends BrowserAgent {
    private qTablePath: string;
    private qTable: Tensor;
    private game: Game;

    constructor(game: Game, qTablePath: string, actionSpace: string[]) {
        super(actionSpace);
        this.qTablePath = qTablePath;
        this.game = game;
    }

    public async load(): Promise<void> {
        const result: Response = await fetch(this.qTablePath);
        const jsonObject = await result.json();
        this.qTable = new Tensor(jsonObject.dim, jsonObject.array);
        return;
    }

    public evalStep(state: object): string {
        const actions: number[] = this.getStateActionValues(state);

        const actionIdx: number = Utils.argMax(actions);
        return this.actionSpace[actionIdx];
    }

    private getStateActionValues(state: object): number[] {
        const indices: number[] = this.game.encodeStateToIndices(state);
        return this.qTable.get(...indices) as number[];
    }
}
