import Agent from './Agent';
import StepResult from './StepResult';
import Environment, { EnvOptions } from './Environment';

export interface GameStateContext {
    isTerminal: boolean;
    maxIterationReached: boolean;
}

abstract class SingleAgentEnvironment implements Environment {
    protected _lastAction?: string;
    protected agent?: Agent;
    protected initialState?: object;
    protected options?: EnvOptions;
    protected randomSeed?: number;

    get name(): string {
        throw new Error('Method not implemented.');
    }

    get gameStateDim(): number[] {
        throw new Error('Method not implemented.');
    }
    get stats(): object {
        throw new Error('Method not implemented.');
    }

    /**
     * @param agent - the Agent Object
     */
    public set setAgent(agent: Agent) {
        this.agent = agent;
    }

    public get lastAction(): string | undefined {
        return this._lastAction;
    }

    /**
     * This method can be used to initialize the environment and for example initialize the agents
     */
    public initAgent(): void {
        if (this.agent) {
            this.agent.init();
        }
    }

    init(
        options?: EnvOptions | undefined,
        initialState?: object | undefined
    ): void {
        this.options = options;
        this.initialState = initialState;
    }

    public setOptions(options: EnvOptions): void {
        this.options = options;
        this.randomSeed = options.randomSeed;
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
        logEvery = -1,
        maxIterationPerGame: number = -1
    ): void {
        this.reset();

        if (this.agent == undefined) {
            throw new Error('No Agent has been set');
        }
        for (let i = 0; i < iterations; i++) {
            while (
                (!this.isTerminal && this.iteration < maxIterationPerGame) ||
                (!this.isTerminal && maxIterationPerGame == -1)
            ) {
                const prevState: object = this.state;
                const nextAction: string = this.agent.step(this.state);
                this._lastAction = nextAction;
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
            if (logEvery !== -1 && i % logEvery === 0) {
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
     * The training loop method as Async Version.
     * @param iterations - numbers of iterations to iterate.
     * @param logEvery - loging interval relative to training iterations.
     * @param maxIterationPerGame - how many iterations for a game until it automatically terminates.
     * If maxIterationPerGame = -1, the game iterates endless.
     */
    public async trainAsync(
        iterations: number = 100,
        logEvery = -1,
        maxIterationPerGame: number = -1
    ): Promise<number> {
        this.reset();

        if (this.agent == undefined) {
            throw new Error('No Agent has been set');
        }
        for (let i = 0; i < iterations; i++) {
            while (
                (!this.isTerminal && this.iteration < maxIterationPerGame) ||
                (!this.isTerminal && maxIterationPerGame == -1)
            ) {
                const prevState: object = this.state;
                const nextAction: string = this.agent.step(this.state);
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
            if (logEvery !== -1 && i % logEvery === 0) {
                this.log(i);
                this.agent.log();
            }
            const isReset = this.reset();
            if (!isReset) {
                break;
            }
        }
        this.log(iterations);
        this.agent.log();
        return iterations;
    }

    /**
     * Is called each iteration defined by the logEvery parameter in the training method
     * @param trainIteration - The current training iteration
     */
    public log(trainIteration: number): void {
        console.log('Iteration:', trainIteration);
    }

    private additionalInfo(maxIterPerGame: number = -1): object {
        const isTerminal = this.isTerminal;
        const maxIterationReached =
            maxIterPerGame != -1 && this.iteration >= maxIterPerGame;
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
    public abstract get actionSpace(): string[];

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
    public abstract get state(): object;

    /**
     * @returns reset the environment.
     */
    public abstract reset(): boolean;

    /**
     * @returns Return True if the environment has reached a final state.
     */
    public abstract get isTerminal(): boolean;

    /**
     * @returns Get The current iteration count of the environment
     */
    public abstract get iteration(): number;

    /**
     * Returns the game state as a number encoded array.
     * @param state - The state object.
     * @returns The game state as number array.
     */
    public abstract encodeStateToIndices(state: object): number[];
}

export default SingleAgentEnvironment;
