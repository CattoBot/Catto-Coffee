import { Data } from "./data";
import { CattoLogger } from "./structures/CattoLogger";
import { CattoClient } from "./structures/BotClient";

const CattoData = Data.getInstance();
const CattoCoffee = new CattoClient();
const CattoLog = new CattoLogger();

CattoCoffee.login(CattoData.Token).then(() => { CattoLog.info('✅') })

export { CattoCoffee }