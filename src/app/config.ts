import * as dotenv from 'dotenv';
import { Status } from '@shared/enum/misc/status.enum';
import { App, Modules, Database } from '@shared/interfaces/core/index';
dotenv.config();

export abstract class Config {

    /**   
     * Application credentials and default settings
     */

    public static readonly app: App = {
        Token: process.env.BOT_TOKEN,
        Owners: process.env.BOT_OWNERS ? process.env.BOT_OWNERS.split(',') : [],
        Guilds: process.env.GUILD_ID ? process.env.GUILD_ID.split(',') : [],
        DefaultPrefix: process.env.DEFAULT_PREFIX,
        Shards: "auto",
        Status: Status.Online,
        refreshCommands: true, // Set to true if you want the commands to be reloaded.
        Activities: [
            'catto.gatitosworld.com',
            'catto.docs.com',
            'Made with 💕'
        ]
    };

    /**
     * Modules settings
     */

    public static readonly Modules: Modules = {
        Experience: {
            Text: {
                ExperienceCooldown: 60
            },
            Voice: {
                ExperienceCooldown: 1
            }
        },
        Voice: {
            CreateChannelCooldown: 60
        }
    }

    /**
     * Database settings
     */

    public static readonly Database: Database = {
        MySQL: {
            URI: process.env.DATABASE_URL,
            Credentials: {
                Host: process.env.DATABASE_HOST,
                Port: parseInt(process.env.DATABASE_PORT),
                Password: process.env.DATABASE_PASSWORD,
                Database: process.env.DATABASE_NAME
            }
        },
        Mongo: {
            URI: process.env.MONGO_URI
        },
        Redis: {
            Host: process.env.REDIS_HOST,
            Port: parseInt(process.env.REDIS_PORT)
        }
    }

    /**
     * Logs settings
     */

    public static readonly Logs = {
        Scope: 'Task',
        InteractiveLogs: false
    }

    public static readonly Utils = {
        EncriptationKey: process.env.ENCRYPTATION_KEY
    }
}   