import seedrandom from "seedrandom";
import { Utils, Tensor, Game } from "../../../shared/src/";
import Agent from "../rlInterface/Agent";
import QLAgentSettings from "./QLAgentSettings";
import { writeFile, readFile } from "node:fs/promises";
import SingleAgentEnvironment from "../rlInterface/Environment";

export default class QLAgent extends Agent {
    private game: Game;
    private config: QLAgentSettings;
    private rng: seedrandom.PRNG;
    private randomSeed?: string;
    private qTable: Tensor;
    private epsilon: number;
    private epsilonStep: number;

    constructor(
        game: Game,
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
        this.game = game;
        this.config = config;
    }

    public get getQTable(): Tensor {
        return this.qTable;
    }

    init(): void {
        const qTableDims: number[] = [...this.config.gameStateDim];
        qTableDims.push(this.actionSpace.length);
        this.qTable = Tensor.Zeros(...qTableDims);
        this.epsilon = this.config.epsilonStart;
        this.epsilonStep = 1;
    }

    step(state: object): string {
        const randNum: number = this.rng();
        this.decayEpsilon();
        if (randNum < this.epsilon) {
            const randIdx = Math.floor(this.rng() * this.actionSpace.length);
            return this.actionSpace[randIdx];
        } else {
            return this.evalStep(state);
        }
    }

    log(): void {
        return;
    }

    evalStep(state: object): string {
        const actions: number[] = this.getStateActionValues(state);
        const actionIdx: number = Utils.argMax(actions);
        return this.actionSpace[actionIdx];
    }
    feed(
        prevState: object,
        takenAction: string,
        newState: object,
        payoff: number
    ): void {
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
                    this.config.discountFactor *
                        (newPossibleActionValues[newBestActionIdx] -
                            prevActionQvalues[takenActionIdx]));

        // update qValue

        this.qTable.set(
            [...this.game.encodeStateToIndices(prevState), takenActionIdx],
            newQValue
        );
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

    private getStateActionValues(state: object): number[] {
        const indices: number[] = this.game.encodeStateToIndices(state);
        return this.qTable.get(...indices) as number[];
    }

    public async saveQTableToFile(path: string): Promise<void> {
        await writeFile(path, JSON.stringify(this.qTable));
    }

    public async loadQTable(path: string): Promise<any> {
        let qtable: Buffer = await readFile(path);
        return JSON.parse(qtable.toString());
    }
}
