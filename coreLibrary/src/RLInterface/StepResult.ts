/**
 * The Result of an Environment Step
 * @category QuickRLInterface
 */
export default interface StepResult {
    /**
     * The new state
     * @type {object}
     */
    newState: object;
    /**
     * The reward gained from the step
     * @type {number}
     */
    reward: number;
}
