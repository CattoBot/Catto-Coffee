import { Prisma } from "../../services/prisma.service";
import { CattoClient } from "../../core/client.main";
import { Messages } from "../../shared/constants/utils/utils.constants";
import { ServerLogger } from "../logs/ServerLogger";

export class LatencyHelper {
    private static log: ServerLogger = new ServerLogger();

    public static checkBotLatency(client: CattoClient) {
        try {
            LatencyHelper.log.info(Messages.Success.ClientSuccess(`${client.ws.ping}ms`));
        } catch (error) {
            LatencyHelper.log.error(Messages.Errors.BotClientError);
        }
    }

    public static async checkDatabaseConnection(prisma: Prisma) {
        try {
            let startTime = Date.now();
            await prisma.$queryRaw`SELECT 1`;
            this.log.success(Messages.Success.DatabaseSuccess(`${Date.now() - startTime}ms`));
        } catch (error) {
            LatencyHelper.log.error(Messages.Errors.DatabaseError);
        }
    }
}
