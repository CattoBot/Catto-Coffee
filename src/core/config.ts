import * as dotenv from 'dotenv';
import { Status } from '@shared/enum/misc/status.enum';
dotenv.config();

export class Config {
    public static readonly Token: string = process.env.BOT_TOKEN
    public static readonly Owners: string[] = [] 
    public static readonly DefaultPrefix: string = "!" 
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
}   