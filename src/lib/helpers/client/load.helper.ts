import { Client } from '@core/client.main';
import { Config } from '@core/config';
import { Messages } from '@shared/constants/utils/utils.constants';
import { ServerLogger } from '@logger';

export class LoadConfigHelper {
  public static token: string = Config.Token;
  public static log: ServerLogger = ServerLogger.getInstance();

  public static async init(client: Client) {
    try {
      await client.login(LoadConfigHelper.token);
    } catch (error) {
      LoadConfigHelper.log.error(Messages.Errors.BotClientError, error.message);
      await client.destroy();
      process.exit(1);
    }
  }
}
