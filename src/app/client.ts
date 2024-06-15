import { LogLevel, SapphireClient, container } from "@sapphire/framework";
import { envParseInteger, envParseString } from "@skyra/env-utilities";
import { GatewayIntentBits, Partials } from "discord.js";
import { PrismaClient } from "@prisma/client";
import { Redis } from "ioredis";
import { ApplicationConsole } from "../lib/console";
import { getRootData } from "@sapphire/pieces";
import { join } from "path";
import { ChatInputDeniedCommandHelper } from "../lib/events/commandDenied";
import { Config } from "../config";
import { getPrefix } from "../lib/utils";
import { InternationalizationContext } from "@sapphire/plugin-i18next";
import { CloudinaryService } from "../lib/services/cloudinary";

export class ApplicationClient extends SapphireClient {
    private rootData = getRootData();
    constructor() {
        super({
            defaultPrefix: Config.prefix,
            regexPrefix: /^(hey +)?catto[,! ]/i,
            caseInsensitiveCommands: true,
            logger: {
                level: LogLevel.Debug
            },
            shards: 'auto',
            intents: [
                GatewayIntentBits.DirectMessageReactions,
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.GuildModeration,
                GatewayIntentBits.GuildEmojisAndStickers,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.MessageContent
            ],
            fetchPrefix: async (message) => {
                if (message.guild?.id) {
                    const prefix = await getPrefix(message.guild.id);
                    return prefix;
                }
                return Config.prefix;
            },
            partials: [Partials.Channel, Partials.User, Partials.GuildMember, Partials.Message],
            presence: {
                status: "idle"
            },
            loadMessageCommandListeners: true,
            tasks: {
                bull: {
                    connection: {
                        port: envParseInteger('REDIS_PORT'),
                        host: envParseString('REDIS_HOST'),
                        db: envParseInteger('REDIS_TASK_DB'),
                    }
                }
            },
            i18n: {
                fetchLanguage: async (context: InternationalizationContext) => {
                    const guild = await container.prisma.guilds.findUnique({ where: { guildId: context.guild?.id } });
                    return guild?.language || 'es-ES';
                }
            },
            loadApplicationCommandRegistriesStatusListeners: true
        });

        this.stores.get('interaction-handlers').registerPath(join(this.rootData.root, 'interactions'));
        this.stores.get('scheduled-tasks').registerPath(join(this.rootData.root, 'tasks'));
        this.stores.get('pattern-commands').registerPath(join(this.rootData.root, 'commands/pattern'));
    }

    public override async login(token?: string): Promise<string> {
        container.prisma = new PrismaClient();
        container.redis = new Redis();
        container.console = new ApplicationConsole();
        container.cloudinary = new CloudinaryService();
        container.commandDeniedHelper = new ChatInputDeniedCommandHelper();
        return super.login(token);
    }
}
