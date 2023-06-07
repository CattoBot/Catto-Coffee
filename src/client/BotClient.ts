import "dotenv/config";
import { LogLevel, SapphireClient } from "@sapphire/framework";
import {
  ActivityType,
  Partials,
  GatewayIntentBits,
  EmbedBuilder,
  CommandInteraction,
  Message
} from "discord.js";
import Config from "../config";

export class BotClient extends SapphireClient {
  public constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
      ],
      partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.Message,
        Partials.User,
      ],
      failIfNotExists: false,
      shards: "auto",
      logger: {
        level: LogLevel.Info,
      },
      loadMessageCommandListeners: true,
      presence: {
        status: "dnd",
      },
    });
  }

  public InteractionEmbed(interaction: CommandInteraction, data: string) {
    if (interaction.deferred) {
      interaction
        .followUp({
          embeds: [
            new EmbedBuilder()
            .setAuthor({
              name: interaction.client.user.tag,
              iconURL: interaction.client.user.displayAvatarURL()
            })
              .setColor(Config.Colors.main)
              .setDescription(`${data.substring(0, 3000)}`),
          ],
        })
        .catch(() => {});
    } else {
      interaction
        .reply({
          embeds: [
            new EmbedBuilder()
              .setColor(Config.Colors.main)
              .setDescription(`${data.substring(0, 3000)}`)
              .setAuthor({
                name: interaction.client.user.tag,
                iconURL: interaction.client.user.displayAvatarURL()
              })
          ],
        })
        .catch(() => {});
    }
  }

  public MessageEmbed(message: Message, data: string) {
    message
      .reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Config.Colors.main)
            .setDescription(`${data.substring(0, 3000)}`),
        ],
      })
      .catch(() => {});
  }

  public override login(token?: string) {
    return super.login(token ?? Config.BotSettings.Token);
  }
}
