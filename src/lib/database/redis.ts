import { Config } from "@app/config";
import { Redis as RedisClient } from "ioredis";

export class RedisCoreModule extends RedisClient {
    public constructor() {
        super({
            host: Config.Database.Redis.Host,
            port: Config.Database.Redis.Port,
            lazyConnect: true
        });
    }

    /**
     * 
     * @returns Promise<void>
     */
    public override async connect(): Promise<void> {
        return await super.connect();
    }
}

export const Redis = new RedisCoreModule();