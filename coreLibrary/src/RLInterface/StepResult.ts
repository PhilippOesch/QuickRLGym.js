/**
 * The Result of an Environment Step
 */
export default interface StepResult {
    /**
     * The new state
     */
    newState: object;
    /**
     * The reward gained from the step
     */
    reward: number;
}
