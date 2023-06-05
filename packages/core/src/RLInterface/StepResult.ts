/**
 * The Result of an Environment Step
 * @param T - the state type
 * @category QuickRLInterface
 */
export default interface StepResult<T extends object> {
    /**
     * The new state
     * @type {T}
     */
    newState: T;
    /**
     * The reward gained from the step
     * @type {number}
     */
    reward: number;
}
