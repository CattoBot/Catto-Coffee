import { ClientOptions, GatewayIntentBits, Partials } from "discord.js";
import { I18nConfig } from "./i18n";
import { Config } from "@core/config";

export class Gateway extends Config {
    public static ClientOptions: ClientOptions = {
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
        allowedMentions: { users: [], roles: [] },
        i18n: { fetchLanguage: I18nConfig.fetchLanguage.bind(I18nConfig) },
        defaultPrefix: this.DefaultPrefix,
        defaultCooldown: { filteredUsers: this.Owners },
        failIfNotExists: false,
        shards: this.Shards,
        loadMessageCommandListeners: true,
    }
}