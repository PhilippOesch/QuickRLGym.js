export default interface QLAgentSettings {
    gameStateDim: number[];
    epsilonStart: number;
    epsilonEnd: number;
    learningRate: number;
    discountFactor: number;
    episodes?: number;
}
