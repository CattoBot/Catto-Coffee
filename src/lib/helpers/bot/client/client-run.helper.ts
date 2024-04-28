import { Client } from '@app/client';
import { Config } from '@app/config';
import { Messages } from '@shared/constants/messages.constants';
import { logger, ServerLogger } from '@logger';

export class ClientRunHelper extends Config {
  private static token: string = Config.app.Token;
  private static log: ServerLogger = logger;

  /**
   * Runs the app and log in the Discord Gateway
   * @param client 
   */

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