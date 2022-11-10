import GameState from "../../../shared/game/GameState";
import Utils from "../../../shared/Utils";
import BrowserAgent from "./BrowserAgent";

export default class QLAgent extends BrowserAgent {
    private qTablePath: string;
    private qTable: Array<any>;

    constructor(qTablePath: string, actionSpace: string[]) {
        super(actionSpace);
        this.qTablePath = qTablePath;
    }

    public async load(): Promise<void> {
        const result: Response = await fetch(this.qTablePath);
        this.qTable = await result.json();
        console.log("json", this.qTable);
        return;
    }

    public evalStep(state: GameState): string {
        const actions: number[] = this.getStateActionValues(state);
        console.log(actions);

        const actionIdx: number = Utils.argMax(actions);
        return this.actionSpace[actionIdx];
    }

    private getStateActionValues(state: GameState): number[] {
        return this.qTable[state.playerPos.getX][state.playerPos.getY][
            state.destinationIdx
        ][state.customerPosIdx] as number[];
    }
}
