import GameState from "../game/GameState";

export default abstract class Agent {
    protected actionSpace: string[];

    constructor(actionSpace: string[]) {
        this.actionSpace = actionSpace;
    }

    public get getActionSpace(): string[] {
        return this.actionSpace;
    }

    /**
     * initialize the agent
     */
    abstract init(): void;

    /**
     * Method for selecting a new action for training
     * @param {GameState} state - The current game state
     * @returns {string} - The action to select next
     */
    abstract step(state: GameState): string;

    /**
     * this method feed the new game state and reward back for the agent to update their algorithm
     * @param {GameState} prevState - The previous game state
     * @param {string} takenAction - The action that was taken.
     * @param {GameState} newState - The new game state
     * @param {number} payoff - The gained payoff for the agent
     */
    abstract feed(
        prevState: GameState,
        takenAction: string,
        newState: GameState,
        payoff: number
    ): void;

    /**
     * Method to select an action for prediction
     * @param {GameState} state - The current game state
     * @returns {string} - The action to select next
     */
    abstract eval_step(state: GameState): string;
}
