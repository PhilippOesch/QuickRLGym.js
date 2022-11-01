import RandomAgent from "./gameClasses/RandomAgent";
import TaxiEnv from "./gameClasses/TaxiEnv";
import TaxiGame from "./gameClasses/TaxiGame";

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
