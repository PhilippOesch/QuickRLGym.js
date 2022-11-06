import seedrandom from "seedrandom";
import GameState from "../game/GameState";
import Utils from "../helper/Utils";
import Agent from "../rlInterface/Agent";
import QLAgentSettings from "./QLAgentSettings";

export default class QLAgent extends Agent {
    private config: QLAgentSettings;
    private rng: seedrandom.PRNG;
    private randomSeed?: string;
    private qTable: object[];

    constructor(
        config: QLAgentSettings,
        actionSpace: string[],
        randomSeed?: number
    ) {
        super(actionSpace);
        if (randomSeed != undefined) {
            this.randomSeed = randomSeed.toString();
            this.rng = seedrandom(this.randomSeed);
        } else {
            this.rng = seedrandom();
        }
        this.config = config;
    }

    init(): void {
        const qTableDims: number[] = [...this.config.gameStateDim];
        qTableDims.push(this.actionSpace.length);
        this.qTable = Utils.genMulitiDArray(qTableDims);
    }

    step(state: GameState): string {
        console.log("test");
        const randNum: number = this.rng();
        if (randNum < this.config.explorationRate) {
            const randIdx = Math.floor(this.rng() * this.actionSpace.length);
            return this.actionSpace[randIdx];
        } else {
            return this.eval_step(state);
        }
    }
    eval_step(state: GameState): string {
        const actions: number[] = this.getStateActionValues(state);

        const actionIdx: number = Utils.argMax(actions);
        return this.actionSpace[actionIdx];
    }
    feed(
        prevState: GameState,
        takenAction: string,
        newState: GameState,
        payoff: number
    ) {
        //lookups
        const takenActionIdx = this.actionSpace.indexOf(takenAction);
        const prevActionQvalues = this.getStateActionValues(prevState);
        const newPossibleActionValues = this.getStateActionValues(newState);
        const newBestActionIdx: number = Utils.argMax(newPossibleActionValues);

        // bellmann equation
        const newQValue: number =
            prevActionQvalues[takenActionIdx] +
            this.config.learningRate *
                (payoff +
                    (this.config.discountFactor +
                        newPossibleActionValues[newBestActionIdx]) -
                    prevActionQvalues[takenActionIdx]);

        // update qValue
        prevActionQvalues[takenActionIdx] = newQValue;
    }

    public printQTable() {
        console.log("QTable", this.qTable);
    }

    private getStateActionValues(state: GameState): number[] {
        return this.qTable[
            (state.playerPos.getX,
            state.playerPos.getY,
            state.destinationIdx,
            state.customerPosIdx)
        ] as number[];
    }
}
