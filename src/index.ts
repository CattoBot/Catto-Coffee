import { BotClient } from "./client/BotClient";
import Config from "./config";

const Client = new BotClient();
Client.login(Config.BotSettings.Token);

declare module "@sapphire/framework" {
    interface Preconditions {
      AdminOnly: never;
      // ...
    }
  }
  
export default Client;