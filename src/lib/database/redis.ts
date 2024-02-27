import { Config } from "@core/config";
import { Redis } from "ioredis";

export class RedisInstance extends Redis {
    constructor() {
        super({
            host: Config.Redis.Host,
            port: Config.Redis.Port,
            password: Config.Redis.Password,
            lazyConnect: true
        });
    }
}