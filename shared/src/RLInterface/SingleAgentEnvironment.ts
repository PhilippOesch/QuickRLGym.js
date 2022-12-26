import Agent from './Agent';
import StepResult from './StepResult';
import Environment from './Environment';

export interface GameStateContext {
    isTerminal: boolean;
    maxIterationReached: boolean;
}

abstract class SingleAgentEnvironment extends Environment {
    protected agent?: Agent;
    protected initialState?: object;

    /**
     * Constructor
     * @param initialState - the initial state of the environment.
     */
    constructor(options?: object, initialState?: object) {
        super((options = options), (initialState = initialState));
    }

    /**
     * @param agent - the Agent Object
     */
    public set setAgent(agent: Agent) {
        this.agent = agent;
    }

    /**
     * This method can be used to initialize the environment and for example initialize the agents
     */
    public initEnv(): void {
        if (this.agent) {
            this.agent.init();
        }
    }

    /**
     * The training loop method.
     * @param iterations - numbers of iterations to iterate.
     * @param logEvery - loging interval relative to training iterations.
     * @param maxIterationPerGame - how many iterations for a game until it automatically terminates.
     * If maxIterationPerGame = -1, the game iterates endless.
     */
    public train(
        iterations: number = 100,
        logEvery = 10,
        maxIterationPerGame: number = -1
    ): void {
        this.reset();

        if (this.agent == undefined) {
            throw new Error('No Agent has been set');
        }
        for (let i = 0; i < iterations; i++) {
            while (
                (!this.getIsTerminal &&
                    this.getIteration < maxIterationPerGame) ||
                (!this.getIsTerminal && maxIterationPerGame == -1)
            ) {
                const prevState: object = this.getState;
                const nextAction: string = this.agent.step(this.getState);
                const { newState, reward } = this.step(nextAction);
                // some algorithms need information about weather the game state is terminal
                const gameStateContext =
                    this.additionalInfo(maxIterationPerGame);
                this.agent.feed(
                    prevState,
                    nextAction,
                    newState,
                    reward,
                    gameStateContext
                );
            }
            this.onIterationEnd();
            if (i % logEvery == 0) {
                this.log(i);
                this.agent.log();
            }
            const isReset = this.reset();
            if (!isReset) {
                break;
            }
        }
    }

    /**
     * Is called each iteration defined by the logEvery parameter in the training method
     * @param trainIteration - The current training iteration
     */
    public log(trainIteration: number): void {
        console.log('Iteration:', trainIteration);
    }

    private additionalInfo(maxIterPerGame: number = -1): object {
        const isTerminal = this.getIsTerminal;
        const maxIterationReached =
            maxIterPerGame != -1 && this.getIteration >= maxIterPerGame;
        return {
            isTerminal: isTerminal,
            maxIterationReached: maxIterationReached,
        };
    }

    /**
     * Function called after the training Iteration and before the logging.
     * This function can be used for example for logging specifig cleanups/ calculations
     */
    public onIterationEnd(): void {
        return;
    }

    /**
     * @returns - The action space of the environment an array of strings (actions possible to select)
     */
    public abstract get getActionSpace(): string[];

    /**
     * Perform an action within the environment
     * @param action - the action to perform.
     * @returns - the new state of the environment.
     */
    public abstract step(action: string): StepResult;

    /**
     * @returns The total Return of the agent.
     */
    public abstract get getReturn(): number;

    /**
     * @returns The state of the environment.
     */
    public abstract get getState(): object;

    /**
     * @returns reset the environment.
     */
    public abstract reset(): boolean;

    /**
     * @returns Return True if the environment has reached a final state.
     */
    public abstract get getIsTerminal(): boolean;

    /**
     * @returns Get The current iteration count of the environment
     */
    public abstract get getIteration(): number;

    /**
     * Returns the game state as a number encoded array.
     * @param state - The state object.
     * @returns The game state as number array.
     */
    public abstract encodeStateToIndices(state: object): number[];
}

export default SingleAgentEnvironment;