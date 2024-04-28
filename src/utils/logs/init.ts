import { Redis, RedisCoreModule } from "@lib/database/redis";
import { logger, ServerLogger } from "@lib/helpers/misc/logger.helper";
import { Client } from "../../app/client";
import { Messages } from "@shared/constants/messages.constants";
import { Logging } from "@shared/interfaces/utils/logging.interface";
import { Prisma, PrismaCoreModule } from "@lib/database/prisma";

export class Init implements Logging {
    private readonly log: ServerLogger
    private readonly redis: RedisCoreModule
    private readonly prisma: PrismaCoreModule

     constructor() {
        this.prisma = Prisma;
        this.log = logger;
        this.redis = Redis;

    }

    public Bot(client: Client) {
        return this.log.success(Messages.Success.ClientSuccess(`${client.ws.ping}ms`))
    }

    public async Prisma() {
        await this.prisma.load().then(() => {
            this.log.success(Messages.Success.DatabaseSuccess());
        }).catch((e) => {
            this.log.error(Messages.Errors.DatabaseError, e);
        })

    }

    public async Redis() {
        await this.redis.ping().then(() => {
            this.log.success(Messages.Success.RedisDatabaseSuccess);
        }).catch((e) => {
            this.log.error(Messages.Errors.RedisError, e);
        })
    }

}