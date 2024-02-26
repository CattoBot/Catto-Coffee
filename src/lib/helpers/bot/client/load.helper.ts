import { Client } from '@core/client.core';
import { Config } from '@core/config';
import { Messages } from '@shared/constants/utils/messages.constants';
import { ServerLogger } from '@logger';
import { PresenceHelper } from './presence.helper';

export class LoadConfigHelper {
  public static token: string = Config.Token;
  public static log: ServerLogger;

  constructor() {
    LoadConfigHelper.log = new ServerLogger();
  }

  public static async init(client: Client) {
    try {
      await client.login(LoadConfigHelper.token);
      await this.setPresence(client);
    } catch (error) {
      LoadConfigHelper.log.error(Messages.Errors.BotClientError, error.message);
      await client.destroy();
      process.exit(1);
    }
  }

  private static async setPresence(client: Client) {
    await PresenceHelper.setPresence(client);
  }
}