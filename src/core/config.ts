import * as dotenv from 'dotenv';
import { Status } from '@shared/enum/misc/status.enum';
dotenv.config();

export class Config {
    public static readonly Token: string = process.env.BOT_TOKEN
    public static readonly Owners: string[] = process.env.BOT_OWNERS ? process.env.BOT_OWNERS.split(',') : [];
    public static readonly DefaultPrefix: string = process.env.DEFAULT_PREFIX;
    public static readonly Shards: number | "auto" | number[] = "auto"
    public static readonly Status: Status = Status.Busy
    public static readonly ChannelCreateCooldown: number = 60

    public static readonly Presence = {
        Activities: [
            'catto.gatitosworld.com',
            'catto.docs.com',
            'Made with 💕'
        ]
    }

    public static readonly Redis = {
        Host: process.env.REDIS_HOST,
        Port: parseInt(process.env.REDIS_PORT),
        Password: process.env.REDIS_PASSWORD
    }

    public static readonly Logs = {
        Scope: 'Task',
        InteractiveLogs: true
    }
}   