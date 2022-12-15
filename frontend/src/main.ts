import { TaxiEnv } from '../../shared/src';
import { TaxiGame } from '../../shared/src/Games/TaxiGame';
import TaxiGameScene from './TaxiGameScene';
import QLAgentBrowser from './Agents/QLAgentBrowser';
import ShowTaxiGameEnv from './ShowAgentEnv';

async function Main() {
    const game: TaxiGame = new TaxiGame(1234);
    const env: TaxiEnv = new TaxiEnv(game);
    const agent: QLAgentBrowser = new QLAgentBrowser(
        env,
        'models/qTable.json',
        TaxiGame.getActionSpace
    );
    const gameScene: TaxiGameScene = new TaxiGameScene(game, false, true);
    const sceneEnv: ShowTaxiGameEnv = new ShowTaxiGameEnv(
        agent,
        game,
        gameScene
    );
    await sceneEnv.init();
    sceneEnv.startGame(true);
}

Main();
