import { Client } from "@core/client.core";
import { Messages } from "@shared/constants/utils/messages.constants";
import { ServerLogger } from "./logger.helper";
import { Init } from "@core/init";

export class LogConnections {
    private static readonly logger: ServerLogger = new ServerLogger();
    private static readonly init: Init = new Init();

    public static async run(client: Client) {
        setTimeout(() => {
            this.logger.await('[%d/6] - Checking bot connectivity...', 1)
            setTimeout(() => {
                this.init.Bot(client);
                setTimeout(() => {
                    this.logger.await('[%d/6] - Checking Redis database connectivity...', 2)
                    setTimeout(() => {
                        this.init.Redis();
                        setTimeout(() => {
                            this.logger.await('[%d/6] - Checking MySQL database connectivity...', 3)
                            setTimeout(() => {
                                this.init.Prisma();
                                setTimeout(() => {
                                    this.logger.await('[%d/6] - Checking MongoDB connectivity...', 4)
                                    setTimeout(() => {
                                        this.init.Mongo();
                                        setTimeout(() => {
                                            this.logger.await('[%d/5] - Starting...', 5)
                                            setTimeout(() => {
                                                this.logger.start(Messages.Success.BotReady(client.application.client.user.username));
                                            }, 1000);
                                        }, 1000);
                                    }, 1000);
                                }, 1000);
                            }, 1000);
                        }, 1000);
                    }, 1000);
                }, 1000);
            }, 1000);
        }, 1000);
    }
}
