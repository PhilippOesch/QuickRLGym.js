import seedrandom from "seedrandom";
import GameState from "../../shared/game/GameState";
import Utils from "../../shared/Utils";
import Agent from "../rlInterface/Agent";
import QLAgentSettings from "./QLAgentSettings";
import { writeFile, readFile } from "node:fs/promises";

export default class QLAgent extends Agent {
    private config: QLAgentSettings;
    private rng: seedrandom.PRNG;
    private randomSeed?: string;
    private qTable: any[];
    private epsilon: number;
    private epsilonStep: number;

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

    public get getQTable(): any[] {
        return this.qTable;
    }

    init(): void {
        const qTableDims: number[] = [...this.config.gameStateDim];
        qTableDims.push(this.actionSpace.length);
        this.qTable = Utils.genMultiDimArray(qTableDims);
        this.epsilon = this.config.epsilonStart;
        this.epsilonStep = 1;
    }

    step(state: GameState): string {
        const randNum: number = this.rng();
        this.decayEpsilon();
        if (randNum < this.epsilon) {
            const randIdx = Math.floor(this.rng() * this.actionSpace.length);
            return this.actionSpace[randIdx];
        } else {
            return this.evalStep(state);
        }
    }
    evalStep(state: GameState): string {
        const actions: number[] = this.getStateActionValues(state);
        const actionIdx: number = Utils.argMax(actions);
        return this.actionSpace[actionIdx];
    }
    feed(
        prevState: GameState,
        takenAction: string,
        newState: GameState,
        payoff: number
    ): void {
        //lookups
        // console.log("feed");
        // console.log(prevState);
        // console.log(takenAction);
        // console.log(newState);
        const takenActionIdx = this.actionSpace.indexOf(takenAction);
        const prevActionQvalues = this.getStateActionValues(prevState);
        const newPossibleActionValues = this.getStateActionValues(newState);
        const newBestActionIdx: number = Utils.argMax(newPossibleActionValues);

        //console.log("payoff", payoff);
        // bellmann equation
        const newQValue: number =
            prevActionQvalues[takenActionIdx] +
            this.config.learningRate *
                (payoff +
                    this.config.discountFactor *
                        (newPossibleActionValues[newBestActionIdx] -
                            prevActionQvalues[takenActionIdx]));
        //console.log(newQValue);

        // const newQValue =
        //     (1 - this.config.learningRate) * prevActionQvalues[takenActionIdx] +
        //     this.config.learningRate *
        //         (payoff +
        //             this.config.discountFactor *
        //                 newPossibleActionValues[newBestActionIdx]);

        // update qValue
        prevActionQvalues[takenActionIdx] = newQValue;
        // this.qTable[prevState.playerPos.getX][prevState.playerPos.getY][
        //     prevState.destinationIdx
        // ][prevState.customerPosIdx][takenActionIdx] = newQValue;
        // console.log(prevActionQvalues[takenActionIdx]);
    }

    public decayEpsilon(): void {
        if (this.epsilonStep < this.config.epsilonDecaySteps) {
            this.epsilonStep++;
            this.epsilon =
                this.config.epsilonStart -
                ((this.config.epsilonStart - this.config.epsilonEnd) /
                    this.config.epsilonDecaySteps) *
                    this.epsilonStep;
        }
    }

    public printQTable() {
        console.log("QTable", this.qTable);
    }

    private getStateActionValues(state: GameState): number[] {
        return this.qTable[state.playerPos.getX][state.playerPos.getY][
            state.destinationIdx
        ][state.customerPosIdx] as number[];
    }

    public log(): void {
        return;
    }

    public async saveQTableToFile(path: string): Promise<void> {
        await writeFile(path, JSON.stringify(this.qTable));
    }

    public async loadQTable(path: string): Promise<any> {
        let qtable: Buffer = await readFile(path);
        return JSON.parse(qtable.toString());
    }
}
