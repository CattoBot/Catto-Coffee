import { Listener, Events } from "@sapphire/framework";
import { Prisma } from "../../client/PrismaClient";
import { VoiceState, CategoryChannel, ChannelType, PermissionFlagsBits } from "discord.js";

const cooldown = new Map<string, number>();

export class CreateVoiceListener extends Listener {
  public constructor(context: Listener.Context, options: Listener.Options) {
    super(context, {
      ...options,
      once: false,
      event: Events.VoiceStateUpdate,
    });
  }

  private async getChannelId(guildId: string): Promise<{ channelId: string; categoryId: string }[]> {
    const data = await Prisma.configTempChannels.findMany({
      where: {
        GuildID: guildId,
      },
    });

    return data.map(result => ({
      channelId: result.TempVoiceChannelCreate,
      categoryId: result.TempVoiceCategory
    }));
  }

  public async run(oldState: VoiceState, newState: VoiceState) {
    const { guild } = newState;
    const { id: guildId } = guild;
    const { id: userId } = newState.member ?? {};
    if (!guildId || !userId) return;

    const channelData = await this.getChannelId(guildId);
    await Promise.all(channelData.map(async ({ channelId, categoryId }) => {
      const categoryChannel = guild.channels.resolve(categoryId) as CategoryChannel;

      if ((newState.channelId === channelId && oldState.channelId !== channelId) || (newState.channelId === channelId && !oldState.channelId)) {
        const userCooldown = cooldown.get(userId);
        if (userCooldown && userCooldown > Date.now()) {
          return;
        }

        cooldown.set(userId, Date.now() + 60000);

        const channelOverwrites = categoryChannel.permissionOverwrites.cache.map((overwrite) => {
          return {
            id: overwrite.id,
            allow: overwrite.allow.bitfield,
            deny: overwrite.deny.bitfield,
          };
        });

        const userPermission = {
          id: userId,
          allow: PermissionFlagsBits.Connect | PermissionFlagsBits.ViewChannel,
          deny: BigInt(0),
        }

        channelOverwrites.push(userPermission);
          
        const newChannel = await guild.channels.create({
        name: `Canal de ${newState.member?.displayName}`,
          type: ChannelType.GuildVoice,
          parent: categoryChannel,
           permissionOverwrites: channelOverwrites
        });

        await Prisma.activeTempVoices.create({
          data: {
            GuildID: guildId,
            ChannelOwner: userId,
            ChannelID: newChannel.id,
            ChannelCategory: `${newChannel.parentId}`,
          },
        });
        
        await newState.member?.voice.setChannel(newChannel);
      }
    }));
  }
}