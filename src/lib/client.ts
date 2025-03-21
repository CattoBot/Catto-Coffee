import { LogLevel, SapphireClient } from '@sapphire/framework';
import { GatewayIntentBits, Partials } from 'discord.js';
import { getRootData } from '@sapphire/pieces';
import { join } from 'path';
import { envParseString } from '@skyra/env-utilities';

export class Client extends SapphireClient {
    private rootData = getRootData();
    constructor() {
        super({
            defaultPrefix: '!',
            regexPrefix: /^(hey +)?bot[,! ]/i,
            caseInsensitiveCommands: true,
            logger: {
                level: LogLevel.Debug
            },
            shards: 'auto',
            intents: [
                GatewayIntentBits.DirectMessageReactions,
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.GuildModeration,
                GatewayIntentBits.GuildExpressions,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.MessageContent
            ],
            partials: [Partials.Channel],
            loadMessageCommandListeners: true,
            presence: {
                status: 'idle'
            },
            tasks: {
                bull: {
                    connection: {
                        url: envParseString('REDIS_URL')
                    }
                }
            },
            loadApplicationCommandRegistriesStatusListeners: true
        })
        this.stores.get('listeners').registerPath(join(this.rootData.root, 'events'));
        this.stores.get('preconditions').registerPath(join(this.rootData.root, 'rules'));
        this.stores.get('interaction-handlers').registerPath(join(this.rootData.root, 'pieces'));
        this.stores.get('scheduled-tasks').registerPath(join(this.rootData.root, 'tasks'));
    }


    public override async login(token?: string): Promise<string> {
        return super.login(token)
    }
}

const app = new Client()
export default app;