import { TaxiEnv } from '../../shared/src';
import { TaxiGame } from '../../shared/src/Games/TaxiGame';
import TaxiGameScene from './TaxiGameScene';
import QLAgentBrowser from './Agents/QLAgentBrowser';
import ShowTaxiGameEnv from './ShowAgentEnv';

async function Main() {
    const env: TaxiEnv = new TaxiEnv(1234);
    const agent: QLAgentBrowser = new QLAgentBrowser(
        env,
        'models/qTable.json',
        TaxiGame.getActionSpace
    );
    const gameScene: TaxiGameScene = new TaxiGameScene(env, false, true);
    const sceneEnv: ShowTaxiGameEnv = new ShowTaxiGameEnv(
        agent,
        env,
        gameScene
    );
    await sceneEnv.init();
    sceneEnv.startGame(true);
}

Main();
