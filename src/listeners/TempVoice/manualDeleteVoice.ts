import { Listener, Events } from "@sapphire/framework";
import { Prisma } from "../../client/PrismaClient";
import { VoiceChannel } from "discord.js";

export class DeleteVoiceListener extends Listener {
  public constructor(context: Listener.Context, options: Listener.Options) {
    super(context, {
      ...options,
      once: false,
      event: Events.ChannelDelete,
    });
  }

  public async run(channel: VoiceChannel) {
    const tempVoice = await Prisma.activeTempVoices.findUnique({
      where: {
        GuildID_ChannelID: {
          GuildID: channel.guild.id,
          ChannelID: channel.id,
        },
      },
    });

    if (tempVoice) {
      await Prisma.activeTempVoices.delete({
        where: {
          GuildID_ChannelID: {
            GuildID: channel.guild.id,
            ChannelID: channel.id,
          },
        },
      }).catch(() => {});
    }
  }
}