import { Listener, Events } from "@sapphire/framework";
import { Prisma } from "../../client/PrismaClient";
import { VoiceState, VoiceChannel } from "discord.js";

export class DeleteVoiceListener extends Listener {
  public constructor(context: Listener.Context, options: Listener.Options) {
    super(context, {
      ...options,
      once: false,
      event: Events.VoiceStateUpdate,
    });
  }

  public async run(oldState: VoiceState, newState: VoiceState) {
    const { channel, channelId } = oldState;
    if (channel && channelId !== newState.channelId && channel.members.size === 0) {
      const voiceChannel = channel as VoiceChannel;
      const guild = voiceChannel.guild;
      const existingChannel = await Prisma.activeTempVoices.findUnique({
        where: {
          GuildID_ChannelID: {
            GuildID: guild.id,
            ChannelID: voiceChannel.id,
          }
        },
      });

      if (existingChannel) {
        await Promise.all([
          voiceChannel.delete(),
          Prisma.activeTempVoices.delete({
            where: {
              GuildID_ChannelID: {
                GuildID: guild.id,
                ChannelID: voiceChannel.id,
              }
            },
          })
        ]).catch((err) => {});
      }
    }
  }
}