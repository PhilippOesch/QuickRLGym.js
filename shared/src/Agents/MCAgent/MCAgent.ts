import {
    Agent,
    Environment,
    Tensor,
    GameStateContext,
    MathUtils,
    FileManager,
    JSONTensor,
} from '../../index';
import seedrandom from 'seedrandom';

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
    valueTable: JSONTensor;
    stateReturnCountTable: JSONTensor;
}

/**
 * Implementation of First visit Monte Carlo
 */
export default class MCAgent extends Agent {
    private config?: MCAgentSettings;
    private rng: seedrandom.PRNG;
    private randomSeed?: string;
    private valueTable: Tensor;
    private stateReturnCountTable: Tensor;
    private experience: ExperienceEntry[] = [];

    private epsilon: number = 0;
    private epsilonStep: number = 0;

    constructor(
        env: Environment,
        config?: MCAgentSettings,
        randomSeed?: number
    ) {
        super(env);
        if (randomSeed != undefined) {
            this.randomSeed = randomSeed.toString();
            this.rng = seedrandom(this.randomSeed);
        } else {
            this.rng = seedrandom();
        }
        this.env = env;
        this.config = config;
    }

    init(): void {
        const valueTableDims: number[] = [...this.env.getGameStateDim];
        valueTableDims.push(this.env.getActionSpace.length);
        this.valueTable = Tensor.Zeros(...valueTableDims);
        this.stateReturnCountTable = Tensor.Zeros(...valueTableDims);
        if (this.config) {
            this.epsilon = this.config.epsilonStart;
        }
    }
    step(state: object): string {
        return this.followEpsGreedyPolicy(state);
    }
    feed(
        prevState: object,
        takenAction: string,
        newState: object,
        payoff: number,
        gameStateContext: GameStateContext
    ): void {
        // buffer experience
        this.experience.push({
            state: this.env.encodeStateToIndices(prevState),
            actionIdx: this.env.getActionSpace.indexOf(takenAction),
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
        const actionIdx: number = MathUtils.argMax(actions);
        return this.env.getActionSpace[actionIdx];
    }

    log(): void {
        //console.log('experience', this.experience);
        console.log('epsilon:', this.epsilon);
        console.log('epsilonStep', this.epsilonStep);
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
            const randIdx = Math.floor(
                this.rng() * this.env.getActionSpace.length
            );
            return this.env.getActionSpace[randIdx];
        } else {
            return this.evalStep(state);
        }
    }

    public async load(
        pathString: string,
        fileManager: FileManager
    ): Promise<void> {
        const loadObject: MCSaveFormat = (await fileManager.load(
            pathString
        )) as MCSaveFormat;
        this.valueTable = Tensor.fromLoadObject(loadObject.valueTable);
        this.stateReturnCountTable = Tensor.fromLoadObject(
            loadObject.stateReturnCountTable
        );
    }

    public async save(
        pathString: string,
        fileManager: FileManager
    ): Promise<void> {
        await fileManager.save(pathString, {
            valueTable: this.valueTable,
            stateReturnCountTable: this.stateReturnCountTable,
        });
    }
}
