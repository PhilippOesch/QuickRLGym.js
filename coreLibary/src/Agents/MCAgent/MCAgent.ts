import {
    Agent,
    Environment,
    GameStateContext,
    FileManager,
    Utils,
} from '../../index';
import seedrandom from 'seedrandom';
import PersistentAgent from '../../RLInterface/TrainableAgent';

export interface MCAgentSettings {
    epsilonStart: number;
    discountFactor: number;
    epsilonEnd?: number;
    epsilonDecaySteps?: number;
}

interface ExperienceEntry {
    state: number[];
    actionIdx: number;
    reward: number;
}

interface MCSaveFormat {
    valueTable: Utils.JSONTensor;
    stateReturnCountTable: Utils.JSONTensor;
}

/**
 * Implementation of First visit Monte Carlo
 */
export default class MCAgent extends Agent implements PersistentAgent {
    private config?: MCAgentSettings;
    private rng: seedrandom.PRNG;
    private randomSeed?: string;
    private valueTable: Utils.Tensor;
    private stateReturnCountTable: Utils.Tensor;
    private experience: ExperienceEntry[] = [];

    private epsilon: number = 0;
    private epsilonStep: number = 0;

    constructor(
        env: Environment,
        config?: MCAgentSettings,
        randomSeed?: number
    ) {
        super(env);
        this.setRandomSeed(randomSeed);
        this.config = config;
    }

    init(): void {
        const valueTableDims: number[] = [...this.env.stateDim];
        valueTableDims.push(this.env.actionSpace.length);
        this.valueTable = Utils.Tensor.Zeros(...valueTableDims);
        this.stateReturnCountTable = Utils.Tensor.Zeros(...valueTableDims);
        if (this.config) {
            this.epsilon = this.config.epsilonStart;
        }
    }

    public setConfig(config?: MCAgentSettings, randomSeed?: number): void {
        if (randomSeed != undefined) this.setRandomSeed(randomSeed);
        if (config != undefined) {
            this.config = config;
            this.epsilon = this.config!.epsilonStart;
            this.epsilonStep = 0;
        }
    }

    step(state: object): string {
        return this.followEpsGreedyPolicy(state);
    }
    async feed(
        prevState: object,
        takenAction: string,
        newState: object,
        payoff: number,
        gameStateContext: GameStateContext
    ): Promise<void> {
        // buffer experience
        this.experience.push({
            state: this.env.encodeStateToIndices(prevState),
            actionIdx: this.env.actionSpace.indexOf(takenAction),
            reward: payoff,
        });
        if (gameStateContext.isTerminal) {
            // use experience for training and then reset experience
            this.mcTrainingStep();
        }
        if (
            gameStateContext.maxIterationReached ||
            gameStateContext.isTerminal
        ) {
            //empty experience
            this.experience = [];
            return;
        }
    }

    public decayEpsilon(): void {
        if (!this.config!.epsilonDecaySteps || !this.config!.epsilonEnd) {
            return;
        }

        if (this.epsilonStep < this.config!.epsilonDecaySteps) {
            this.epsilonStep++;
            this.epsilon =
                this.config!.epsilonStart -
                ((this.config!.epsilonStart - this.config!.epsilonEnd) /
                    this.config!.epsilonDecaySteps) *
                    this.epsilonStep;
        }
    }

    evalStep(state: object): string {
        const actions: number[] = this.getStateActionValues(state);
        const actionIdx: number = Utils.MathUtils.argMax(actions);
        return this.env.actionSpace[actionIdx];
    }

    log(): void {
        //console.log('experience', this.experience);
        console.log('epsilon:', this.epsilon);
        console.log('epsilonStep', this.epsilonStep);
    }

    /**
     * Set the random Seed for the agent
     * @param randomSeed - the random seed
     */
    private setRandomSeed(randomSeed?: number) {
        if (randomSeed != undefined) {
            this.randomSeed = randomSeed.toString();
            this.rng = seedrandom(this.randomSeed);
        } else {
            this.rng = seedrandom();
        }
    }

    private mcTrainingStep() {
        let g: number = 0;
        let visitedExperiences: ExperienceEntry[] = [];
        this.decayEpsilon();
        for (let i = this.experience.length - 1; i >= 0; i--) {
            const idxExperience: ExperienceEntry = this.experience[i];
            g = g * this.config!.discountFactor + idxExperience.reward;
            const alreadyVisited: boolean = this.stateAlreadyVisited(
                idxExperience.state,
                visitedExperiences
            );
            if (!alreadyVisited) {
                visitedExperiences.push(idxExperience);
                let stateReturnCount: number = this.stateReturnCountTable.get(
                    ...idxExperience.state,
                    idxExperience.actionIdx
                ) as number;
                stateReturnCount++;
                this.stateReturnCountTable.set(
                    [...idxExperience.state, idxExperience.actionIdx],
                    stateReturnCount
                );
                const oldMean: number = this.valueTable.get(
                    ...idxExperience.state,
                    idxExperience.actionIdx
                ) as number;
                const newMean =
                    (oldMean / stateReturnCount) * (stateReturnCount - 1) +
                    g / stateReturnCount;
                this.valueTable.set(
                    [...idxExperience.state, idxExperience.actionIdx],
                    newMean
                );
            }
        }
    }

    private stateAlreadyVisited(
        state: number[],
        visitedExperiences: ExperienceEntry[]
    ): boolean {
        const found = visitedExperiences.find((entry: ExperienceEntry) => {
            return entry.state.every((val, idx) => val === state[idx]);
        });
        if (found !== undefined) return true;
        return false;
    }

    private getStateActionValues(state: object): number[] {
        const indices: number[] = this.env.encodeStateToIndices(state);
        return this.valueTable.get(...indices) as number[];
    }

    private followEpsGreedyPolicy(state: object): string {
        const randNum: number = this.rng();
        if (randNum < this.epsilon) {
            return this.sampleRandomAction();
        } else {
            return this.evalStep(state);
        }
    }

    private sampleRandomAction() {
        const randIdx = Math.floor(this.rng() * this.env.actionSpace.length);
        return this.env.actionSpace[randIdx];
    }

    public async load(fileManager: FileManager): Promise<void> {
        const loadObject: MCSaveFormat =
            (await fileManager.load()) as MCSaveFormat;
        this.valueTable = Utils.Tensor.fromJSONObject(loadObject.valueTable);
        this.stateReturnCountTable = Utils.Tensor.fromJSONObject(
            loadObject.stateReturnCountTable
        );
    }

    public async save(fileManager: FileManager, path?: string): Promise<void> {
        await fileManager.save(
            {
                valueTable: this.valueTable,
                stateReturnCountTable: this.stateReturnCountTable,
            },
            path
        );
    }

    async loadConfig(
        fileManager: FileManager,
        path?: string | undefined
    ): Promise<void> {
        const loadObject: MCAgentSettings = <MCAgentSettings>(
            await fileManager.load(path)
        );
        this.setConfig(loadObject);
    }
    async saveConfig(
        fileManager: FileManager,
        path?: string | undefined
    ): Promise<void> {
        await fileManager.save(this.config!, path);
    }
}
