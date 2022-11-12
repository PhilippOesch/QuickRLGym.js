import GameState from "../../../shared/src/game/GameState";

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
     * @param {object} state - The current game state
     * @returns {string} - The action to select next
     */
    abstract step(state: object): string;

    /**
     * this method feed the new game state and reward back for the agent to update their algorithm
     * @param {object} prevState - The previous game state
     * @param {string} takenAction - The action that was taken.
     * @param {object} newState - The new game state
     * @param {number} payoff - The gained payoff for the agent
     */
    abstract feed(
        prevState: object,
        takenAction: string,
        newState: object,
        payoff: number
    ): void;

    /**
     * Method to select an action for prediction
     * @param {object} state - The current game state
     * @returns {string} - The action to select next
     */
    abstract evalStep(state: object): string;

    abstract log(): void;
}
