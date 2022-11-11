import GameState from "./GameState";

export default interface StepResult {
    readonly newState: GameState;
    readonly reward: number;
}
