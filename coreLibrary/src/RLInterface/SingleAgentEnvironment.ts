import Agent from './Agent';
import Environment, { EnvOptions } from './Environment';

/**
 * The EnvStateContext
 * @category QuickRLInterface
 */
export interface EnvStateContext {
    /**
     * Whether the environment has terminated
     * @type {boolean}
     */
    isTerminal: boolean;
    /**
     * Wheather the max iteration was reached
     * @type {boolean}
     */
    maxIterationReached: boolean;
}

/**
 * Describes a single expericence of an enviroment step
 * @category QuickRLInterface
 */
export interface Experience {
    /**
     * The encoded previous state
     * @type {number[]}
     */
    prevState: number[];
    /**
     * The taken action index
     * @type {number}
     */
    takenAction: number;
    /**
     * The encoded new state
     * @type {number[]}
     */
    newState: number[];
    /**
     * the payoff
     * @type {number}
     */
    payoff: number;
    /**
     * The environment context
     * @type {EnvStateContext}
     */
    contextInfo: EnvStateContext;
}

/**
 * An environment with a single agent
 * @abstract
 * @extends Environment
 * @category QuickRLInterface
 */
export abstract class SingleAgentEnvironment extends Environment {
    protected _lastAction?: string;
    protected _agent?: Agent;
    protected initialState?: object;
    protected _options?: EnvOptions;
    protected randomSeed?: number;

    get options(): EnvOptions | undefined {
        return this._options;
    }

    /**
     * get the agent
     * @type {Agent | undefined}
     */
    public get agent(): Agent | undefined {
        return this._agent;
    }

    /**
     * set the agent
     * @type {Agent | undefined}
     */
    public set agent(agent: Agent | undefined) {
        this._agent = agent;
    }

    /**
     * get the last action
     * @type {string | undefined}
     */
    public get lastAction(): string | undefined {
        return this._lastAction;
    }

    /**
     * This method can be used to initialize the environment and for example initialize the agents
     * @returns {void} test
     */
    public initAgent(): void {
        if (this._agent !== undefined) {
            this._agent.init();
        } else {
            throw new Error('initAgent can not be called without an agent set');
        }
    }

    public init(
        options?: EnvOptions | undefined,
        initialState?: object | undefined
    ): void {
        this._options = options;
        this.initialState = initialState;
    }

    public setOptions(options: EnvOptions): void {
        this._options = options;
        this.randomSeed = options.randomSeed;
    }

    /**
     * The training loop method as Async Version.
     * @param {number} iterations - numbers of iterations to iterate.
     * @param {number} logEvery - loging interval relative to training iterations.
     * @param {number} maxIterationPerGame - how many iterations for a game until it automatically terminates.
     * @param {boolean} resetStatsOnLog - bool to indicate the reseting of stats after logging
     * @returns {Promise<number>}
     */
    public async train(
        iterations: number = 100,
        logEvery: number = -1,
        maxIterationPerGame: number = -1,
        resetStatsOnLog: boolean = true
    ): Promise<number> {
        this.resetStats();
        this.reset();

        if (this._agent === undefined) {
            throw new Error('No Agent has been set');
        }
        for (let i = 0; i < iterations; i++) {
            while (
                (!this.isTerminal && this.iteration < maxIterationPerGame) ||
                (!this.isTerminal && maxIterationPerGame == -1)
            ) {
                await this.singleTrainStep(maxIterationPerGame);
            }
            this.onIterationEnd();
            if (logEvery !== -1 && i % logEvery === 0) {
                this.log(i);
                this._agent.log();
                if (resetStatsOnLog) this.resetStats();
            }
            const isReset = this.reset();
            if (!isReset) {
                break;
            }
        }
        this.log(iterations);
        this._agent.log();
        return iterations;
    }

    /**
     * Is called each iteration defined by the logEvery parameter in the training method
     * @param trainIteration - The current training iteration
     * @returns {void}
     */
    public log(trainIteration: number): void {
        console.log('Iteration:', trainIteration);
    }

    /**
     * Get additional info about the environment state
     * @param {number} EnvStateContext EnvStateContext maxIterPerGame
     * @returns {EnvStateContext}
     */
    public additionalInfo(maxIterPerGame: number = -1): EnvStateContext {
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
     * @returns {void}
     */
    public onIterationEnd(): void {
        return;
    }

    /**
     * The total Return of the agent.
     * @type {number}
     */
    public abstract get getReturn(): number;

    /**
     * A single trainign step
     * @param {number} maxIterationPerGame - The max iterations per game
     * @returns {Promise<void>}
     */
    private async singleTrainStep(maxIterationPerGame: number): Promise<void> {
        const prevState: object = this.state;
        const nextAction: string = this._agent!.step(prevState);
        const { newState, reward } = this.step(nextAction);
        const envStateContext = this.additionalInfo(maxIterationPerGame);
        let rewardAdjusted =
            this._options?.penaltyOnUnfinished &&
            envStateContext.maxIterationReached &&
            !envStateContext.isTerminal
                ? this._options?.penaltyOnUnfinished + reward
                : reward;
        await this._agent!.feed(
            prevState,
            nextAction,
            newState,
            rewardAdjusted,
            envStateContext
        );
    }
}
