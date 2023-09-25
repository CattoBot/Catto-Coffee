import { BotData } from "./data";
import { CattoClient } from "./structures/BotClient";
import { CattoLogger } from "./structures/CattoLogger";
const Catto_Data = BotData.getInstance();
const Catto_Coffee = new CattoClient();
const CattoLog = new CattoLogger();

Catto_Coffee.login(Catto_Data.getToken)
//   .then(() => {
//       Catto_Coffee.application.commands.set([]).then(() => {
//           CattoLog.info(`Refreshing commands...`)
//       })
//   });

export { Catto_Coffee }