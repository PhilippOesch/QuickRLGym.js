import RandomAgent from "./rlInterface/RandomAgent";
import TaxiEnv from "./rlInterface/TaxiEnv";
import TaxiGame from "./game/TaxiGame";

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
}
