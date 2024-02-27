import { Client } from "@core/client.core";
import { Messages } from "@shared/constants/utils/messages.constants";
import { ServerLogger } from "./logger.helper";
import { Init } from "@core/init";

export class LogConnections {
    private static readonly logger: ServerLogger = new ServerLogger();
    private static readonly init: Init = new Init();

    public static async log(client: Client) {
        setTimeout(() => {
            this.logger.await('[%d/5] - Checking bot connectivity...', 1)
            setTimeout(() => {
                this.init.InitBot(client);
                setTimeout(() => {
                    this.logger.await('[%d/5] - Checking MySQL database connectivity...', 2)
                    setTimeout(() => {
                        this.init.InitMySQL();
                        setTimeout(() => {
                            this.logger.await('[%d/5] - Checking Redis database connectivity...', 3)
                            setTimeout(() => {
                                this.init.InitRedis();
                                setTimeout(() => {
                                    this.logger.await('[%d/5] - Starting bot...', 5)
                                    setTimeout(() => {
                                        this.logger.start(Messages.Success.BotReady(client.application.client.user.username));
                                    }, 2000);
                                }, 2000);
                            }, 2000);
                        }, 2000);
                    }, 2000);
                }, 2000);
            }, 2000);
        }, 2000);
    }
}
