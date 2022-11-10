export default interface QLAgentSettings {
    gameStateDim: number[];
    learningRate: number;
    discountFactor: number;
    epsilonStart: number;
    epsilonEnd: number;
    epsilonDecaySteps: number;
    episodes?: number;
}
