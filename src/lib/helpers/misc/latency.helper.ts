import { PrismaClient } from "@prisma/client";
import { Client } from "@core/client.core";
import { Messages } from "@shared/constants/utils/messages.constants";
import { ServerLogger } from "@logger";
import { RedisInstance } from "@lib/database/redis";

export class LatencyHelper {
    private static readonly log = new ServerLogger();
    private static readonly redis = new RedisInstance();

    public static checkBotLatency(client: Client) {
        try {
            this.log.watch(Messages.Success.ClientSuccess(`${client.ws.ping}ms`));
        } catch (error) {
            this.log.error(Messages.Errors.BotClientError, error);
        }
    }

    public static async checkDatabaseConnection(prisma: PrismaClient) {
        try {
            let startTime = performance.now();
            await prisma.$queryRaw`SELECT 1`;
            let endTime = performance.now();
            const ping = (endTime - startTime).toFixed(2);
            LatencyHelper.log.success(Messages.Success.DatabaseSuccess(`${ping}ms`));
        } catch (error) {
            LatencyHelper.log.error(Messages.Errors.DatabaseError, error);
        }
    }

    public static async checkRedisConnection() {
        try {
            const result = await this.redis.ping();
            if (!result) {
                LatencyHelper.log.error(Messages.Errors.RedisError);
            } else {
                LatencyHelper.log.success(Messages.Success.RedisDatabaseSuccess);
            }
        } catch (error) {
            LatencyHelper.log.error(Messages.Errors.RedisError, error);
        }
    }

    public static async LogConnections(client: Client) {
        setTimeout(() => {
            this.log.await('[%d/5] - Checking bot connectivity...', 1)
            setTimeout(() => {
                this.checkBotLatency(client);
                setTimeout(() => {
                    this.log.await('[%d/5] - Checking MySQL database connectivity...', 2)
                    setTimeout(() => {
                        this.checkDatabaseConnection(new PrismaClient());
                        setTimeout(() => {
                            this.log.await('[%d/5] - Checking Redis database connectivity...', 3)
                            setTimeout(() => {
                                this.checkRedisConnection();
                                setTimeout(() => {
                                    this.log.await('[%d/5] - Starting bot...', 5)
                                    setTimeout(() => {
                                        this.log.start(Messages.Success.BotReady(client.application.client.user.username));
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
