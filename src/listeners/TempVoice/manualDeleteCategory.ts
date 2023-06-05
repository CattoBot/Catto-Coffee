import { Listener, Events } from "@sapphire/framework";
import { Prisma } from "../../client/PrismaClient";
import { CategoryChannel } from "discord.js";

export class DeleteCategoryListener extends Listener {
  public constructor(context: Listener.Context, options: Listener.Options) {
    super(context, {
      ...options,
      once: false,
      event: Events.ChannelDelete,
    });
  }

  public async run(channel: CategoryChannel) {
    const tempVoice = await Prisma.configTempChannels.findUnique({
      where: {
        GuildID_TempVoiceCategory: {
            GuildID: channel.guild.id,
            TempVoiceCategory: channel.id,
        }
      },
    });

    if (tempVoice) {
        await Prisma.configTempChannels.delete({
            where: {
                GuildID_TempVoiceCategory: {
                    GuildID: channel.guild.id,
                    TempVoiceCategory: channel.id,
                }
            },
        }).catch((err) => {});
    }
  }
}