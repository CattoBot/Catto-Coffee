import { RedisInstance } from "@lib/database/redis";
import { ServerLogger } from "@lib/helpers/misc/logger.helper";
import { PrismaClient } from "@prisma/client";
import { Client } from "./client.core";
import { Messages } from "@shared/constants/utils/messages.constants";
import { ICore } from "@shared/interfaces/core.interface";

export class Init implements ICore {
    private readonly log: ServerLogger
    private readonly redis: RedisInstance
    private readonly prisma: PrismaClient

    constructor() {
        this.prisma = new PrismaClient();
        this.log = new ServerLogger();
        this.redis = new RedisInstance();
    }

    public InitBot(client: Client) {
        try {
            this.log.watch(Messages.Success.ClientSuccess(`${client.ws.ping}ms`));
        } catch (error) {
            this.log.error(Messages.Errors.BotClientError, error);
        }
    }

    public async InitMySQL() {
        try {
            await this.prisma.$connect();
            this.log.success(Messages.Success.DatabaseSuccess());
        } catch (error) {
            this.log.error(Messages.Errors.DatabaseError, error);
        }
    }

    public async InitRedis() {
        try {
            await this.redis.connect();
            this.log.success(Messages.Success.RedisDatabaseSuccess);
        } catch (error) {
            this.log.error(Messages.Errors.RedisError, error);
        }
    }
}