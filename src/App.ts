import { Data } from "./config";
import { CattoClient } from "./structures/BotClient";
import { CattoLogger } from "./structures/CattoLogger";
const Catto_Data = Data.getInstance();
const Catto_Coffee = new CattoClient();
const CattoLog = new CattoLogger();

Catto_Coffee.login(Catto_Data.getToken).then(() => { CattoLog.info(`✅`)})

export { Catto_Coffee }