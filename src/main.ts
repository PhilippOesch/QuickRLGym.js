import RandomAgent from "./gameClasses/RandomAgent";
import TaxiEnv from "./gameClasses/TaxiEnv";
import TaxiGame from "./gameClasses/TaxiGame";

export module Main {
    const actionSpace: string[] = Array.from(TaxiGame.actionMapping.keys());
    const randomSeed: number = 12;
    const env: TaxiEnv = new TaxiEnv(
        new TaxiGame(randomSeed),
        new RandomAgent(actionSpace, randomSeed),
        true
    );
    env.initGame(false, true);
    env.train(100);
}
