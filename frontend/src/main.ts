//import QLAgentBrowser from './Agents/QLAgentBrowser';
import { QLAgent } from '../../shared/src';
import BrowserFileManager from './BrowserFileManager';
import ShowTaxiGameEnv, { ShowTaxiOptions } from './ShowTaxiGameEnv';

const fileManager = new BrowserFileManager();

async function Main() {
    const options: ShowTaxiOptions = {
        interactiveMode: false,
    };
    const sceneEnv: ShowTaxiGameEnv = new ShowTaxiGameEnv(options);
    const agent = new QLAgent(sceneEnv.getEnv);
    await agent.loadQTable('models/qTable.json', fileManager);
    sceneEnv.setAgent = agent;
    await sceneEnv.init();
    sceneEnv.startGame(true);
}

Main();
