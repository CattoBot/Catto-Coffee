import { Config } from "@core/config";
import { Redis as RedisClient } from "ioredis";

export class Redis extends RedisClient {
    constructor() {
        super({
            host: Config.Redis.Host,
            port: Config.Redis.Port
        });
    }

    /**
     * 
     * @returns Redis connection
     */

    public override async connect(): Promise<void> {
        return await super.connect();
    }
}