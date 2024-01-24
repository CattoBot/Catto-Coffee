import { CattoClient } from '../../core/client.main';
import { Messages } from '../../shared/constants/utils/utils.constants';
import { ServerLogger } from '../logs/ServerLogger';
import { Properties } from '../../shared/constants/client/properties.constants';

export class LoadConfigHelper {
    public static token: string = Properties.Token;
    public static log: ServerLogger = new ServerLogger();

    public static async mount(client: CattoClient) {
        try {
            await client.login(LoadConfigHelper.token);
        } catch (error) {
            LoadConfigHelper.log.error(Messages.Errors.BotClientError, error.message)
        }
    }
}
