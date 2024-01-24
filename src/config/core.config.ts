import * as dotenv from 'dotenv';
dotenv.config();

export class Config {
    public static readonly Token: string = process.env.BOT_TOKEN
    public static readonly Owners: string[] = [] // bot owners id
    public static readonly DefaultPrefix: string = "!" // bot default prefix 
    public static readonly Shards: number | "auto" | number[] = "auto" // automatic shards

    public static readonly Presence = {
        Activities: [
            'catto.gatitosworld.com',
            'catto.docs.com',
            'Made with 💕'
        ]
    }
}