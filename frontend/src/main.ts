import QLAgentBrowser from './Agents/QLAgentBrowser';
import ShowTaxiGameEnv, { ShowTaxiOptions } from './ShowTaxiGameEnv';

async function Main() {
    const options: ShowTaxiOptions = {
        interactiveMode: false,
    };
    const sceneEnv: ShowTaxiGameEnv = new ShowTaxiGameEnv(options);
    const agent: QLAgentBrowser = new QLAgentBrowser(
        sceneEnv.getEnv,
        'models/qTable.json'
    );
    sceneEnv.setAgent = agent;
    await sceneEnv.init();
    sceneEnv.startGame(true);
}

Main();
