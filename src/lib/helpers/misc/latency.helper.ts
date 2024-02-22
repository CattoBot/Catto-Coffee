import { PrismaClient } from "@prisma/client";
import { Client } from "@core/client.main";
import { Messages } from "@shared/constants/utils/utils.constants";
import { ServerLogger } from "@logger";

export class LatencyHelper {
    public static log: ServerLogger = ServerLogger.getInstance();
    public static checkBotLatency(client: Client) {
        try {
            LatencyHelper.log.info(Messages.Success.ClientSuccess(`${client.ws.ping}ms`));
        } catch (error) {
            LatencyHelper.log.error(Messages.Errors.BotClientError);
        }
    }

    public static async checkDatabaseConnection(prisma: PrismaClient) {
        try {
            let startTime = Date.now();
            await prisma.$queryRaw`SELECT 1`;
            this.log.success(Messages.Success.DatabaseSuccess(`${Date.now() - startTime}ms`));
        } catch (error) {
            LatencyHelper.log.error(Messages.Errors.DatabaseError);
        }
    }
}
