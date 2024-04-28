import { ClientOptions, GatewayIntentBits, Partials } from "discord.js";
import { I18Next as i18n } from "./i18n";
import { Config } from "@app/config";
import { LogLevel } from "@sapphire/framework";

export class Gateway extends Config {
    public static Client: ClientOptions = {
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildModeration,
            GatewayIntentBits.GuildEmojisAndStickers,
            GatewayIntentBits.GuildVoiceStates,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildMessageReactions,
            GatewayIntentBits.DirectMessages,
            GatewayIntentBits.DirectMessageReactions,
            GatewayIntentBits.MessageContent
        ],
        partials: [
            Partials.Channel,
            Partials.GuildMember,
            Partials.Message,
            Partials.Reaction,
            Partials.User,
        ],
        logger: { level: LogLevel.Info },
        allowedMentions: { users: [], roles: [] },
        i18n: { fetchLanguage: i18n.fetch.bind(i18n) },
        defaultPrefix: this.app.DefaultPrefix,
        defaultCooldown: { filteredUsers: this.app.Owners },
        failIfNotExists: false,
        shards: this.app.Shards,
        loadMessageCommandListeners: true,
    }
}   
