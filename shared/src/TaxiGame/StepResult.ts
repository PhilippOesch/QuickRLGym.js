import GameState from "./GameState";

export default interface StepResult {
    readonly newState: object;
    readonly reward: number;
}
