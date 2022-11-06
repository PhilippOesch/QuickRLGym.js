import RandomAgent from "./RLAgents/RandomAgent";
import TaxiEnv from "./rlInterface/TaxiEnv";
import TaxiGame from "./game/TaxiGame";
//import QLAgent from "./RLAgents/QLAgent";

//import Utils from "./helper/Utils";

export module Main {
    const actionSpace: string[] = Array.from(TaxiGame.actionMapping.keys());
    //const randomSeed: number = 12;
    const env: TaxiEnv = new TaxiEnv(
        new TaxiGame(),
        new RandomAgent(actionSpace),
        true
    );
    env.initGame(true, true);
    env.startGame(true);
    // const actionSpace: string[] = Array.from(TaxiGame.actionMapping.keys());
    // const randomSeed: number = 12;

    // const qlAgent: QLAgent = new QLAgent(
    //     {
    //         gameStateDim: [5, 5, 4, 5],
    //         explorationRate: 0.1,
    //         learningRate: 0.01,
    //         discountFactor: 0.1,
    //     },
    //     actionSpace,
    //     randomSeed
    // );
    // const env: TaxiEnv = new TaxiEnv(new TaxiGame(), qlAgent, true);
    // env.initGame(false, false);
    // env.train(10);
    // qlAgent.printQTable();

    // Text array gen
    // const array: any = Utils.genMulitiDArray([4, 4, 4]);
    // console.log(array);
    // console.log(array[0][0][0]);
}
