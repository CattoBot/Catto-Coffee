import { LogLevel, SapphireClient } from "@sapphire/framework";
import { Partials, GatewayIntentBits, ActivityType } from "discord.js";
import { Data } from "../data";
import { Time } from "@sapphire/time-utilities";
const filteredUsers = Data.getInstance().Owners || [];

export class CattoClient extends SapphireClient {
  public constructor() {
    super({
      intents: [GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.DirectMessageReactions,
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.GuildMessageReactions,
      ],
      partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.Message,
        Partials.User,
      ],
      defaultPrefix: Data.getInstance().Prefix,
      defaultCooldown: {
        delay: Time.Second * 5,
        filteredUsers: filteredUsers,
      },
      failIfNotExists: false,
      shards: "auto",
      logger: {
        level: LogLevel.Info,
      },
      loadMessageCommandListeners: true,

      presence: {
        status: "dnd",
        activities: [
          {
            name: 'Galaxy',
            type: ActivityType.Playing
          }
        ]
      },
    });
  }
}