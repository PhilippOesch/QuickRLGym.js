import { MathUtils, Tensor, TaxiEnv } from '../../../shared/src';
import BrowserAgent from './BrowserAgent';

export default class QLAgent extends BrowserAgent {
    private qTablePath: string;
    private qTable: Tensor;
    private env: TaxiEnv;

    constructor(env: TaxiEnv, qTablePath: string, actionSpace: string[]) {
        super(actionSpace);
        this.qTablePath = qTablePath;
        this.env = env;
    }

    public async load(): Promise<void> {
        const result: Response = await fetch(this.qTablePath);
        const jsonObject = await result.json();
        this.qTable = new Tensor(jsonObject.dim, jsonObject.array);
        return;
    }

    public evalStep(state: object): string {
        const actions: number[] = this.getStateActionValues(state);

        const actionIdx: number = MathUtils.argMax(actions);
        return this.actionSpace[actionIdx];
    }

    private getStateActionValues(state: object): number[] {
        const indices: number[] = this.env.encodeStateToIndices(state);
        return this.qTable.get(...indices) as number[];
    }
}
