import { Redis } from "@lib/database/redis";
import { ServerLogger } from "@lib/helpers/misc/logger.helper";
import { Client } from "./client.core";
import { Messages } from "@shared/constants/utils/messages.constants";
import { Logging } from "@shared/interfaces/utils/logging.interface";
import { Prisma } from "@lib/database/prisma";
import { Mongo } from "@lib/database/mongo";
import { Config } from "./config";

export class Init implements Logging {

    private readonly log: ServerLogger
    private readonly redis: Redis
    private readonly prisma: Prisma
    private readonly mongo: Mongo

    public constructor() {
        this.prisma = new Prisma();
        this.log = new ServerLogger();
        this.redis = new Redis();
        this.mongo = new Mongo();
    }

    public Bot(client: Client) {
        try {
            this.log.success(Messages.Success.ClientSuccess(`${client.ws.ping}ms`));
        } catch (error) {
            this.log.error(Messages.Errors.BotClientError, error);
        }
    }

    public async Prisma() {
        try {
            await this.prisma.load().then(() => {
                this.log.success(Messages.Success.DatabaseSuccess());
            });
        } catch (error) {
            this.log.error(Messages.Errors.DatabaseError, error);
        }
    }

    public async Redis() {
        try {
            const ping = await this.redis.ping()
            if (ping) {
                return this.log.success(Messages.Success.RedisDatabaseSuccess);
            }
        } catch (error) {
            this.log.error(Messages.Errors.RedisError, error);
        }
    }

    public async Mongo() {
        try {
            await this.mongo.fetch(Config.Mongo.URI);
            this.log.success(Messages.Success.MongoDatabaseSuccess);
        } catch (error) {
            this.log.error(Messages.Errors.MongoError, error);
        }
    }
}