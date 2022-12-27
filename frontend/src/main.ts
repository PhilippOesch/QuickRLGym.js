//import QLAgentBrowser from './Agents/QLAgentBrowser';
import { Agents } from '../../shared/src';
import BrowserFileManager from './BrowserFileManager';
import ShowBlackJackEnv, {
    ShowBlackJackOptions,
} from './BlackJackGame/ShowBlackJackEnv';
import ShowTaxiGameEnv, { ShowTaxiOptions } from './TaxiGame/ShowTaxiGameEnv';

const fileManager = new BrowserFileManager();

async function MainTaxi() {
    const options: ShowTaxiOptions = {
        interactiveMode: false,
    };
    const sceneEnv: ShowTaxiGameEnv = new ShowTaxiGameEnv(options);
    const agent = new Agents.QLAgent(sceneEnv.getEnv);
    //const agent = new MCAgent(sceneEnv.getEnv);
    await agent.load('models/taxi/qTable.json', fileManager);
    //await agent.load('models/taxi/mcagent.json', fileManager);
    sceneEnv.setAgent = agent;
    await sceneEnv.init();
    sceneEnv.startGame(true, 100, -1);
}

//MainTaxi();

async function MainBlackJack() {
    const options: ShowBlackJackOptions = {
        interactiveMode: false,
    };
    const sceneEnv: ShowBlackJackEnv = new ShowBlackJackEnv(options);
    const agent = new Agents.MCAgent(sceneEnv.getEnv);
    await agent.load('models/blackJack/mcagent.json', fileManager);
    sceneEnv.setAgent = agent;
    await sceneEnv.init();
    sceneEnv.startGame(true);
}

MainBlackJack();
