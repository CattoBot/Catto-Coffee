import { Client } from "@app/client";
import { Messages } from "@shared/constants/messages.constants";
import { logger, ServerLogger } from "./logger.helper";
import { Init } from "@utils/logs/init";

export class LogConnections {
    private static readonly logger: ServerLogger = logger;
    private static readonly init: Init = new Init();

    public static async run(client: Client) {
        this.init.Bot(client);
        await this.init.Redis();
        await this.init.Prisma();
        this.logger.start(Messages.Success.BotReady(client.application.client.user.username));
    }
}
