import { Client } from '@core/client.core';
import { Config } from '@core/config';
import { Messages } from '@shared/constants/utils/messages.constants';
import { ServerLogger } from '@logger';

export class ClientRunHelper extends Config {
  private static token: string = Config.Token;
  private static log: ServerLogger = new ServerLogger();

  public static async run(client: Client) {
    try {
      await client.login(this.token);
    } catch (error) {
      await client.destroy();
      this.log.error(Messages.Errors.BotClientError, error.message);
      process.exit(1);
    }
  }
}