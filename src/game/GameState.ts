import Vec2 from "./Vec2";

export default interface GameState {
    playerPos: Vec2;
    customerPos: Vec2;
    isCustomerPickedUp: boolean;
    iterations: number;
    points: number;
    isTerminal: boolean;
}
