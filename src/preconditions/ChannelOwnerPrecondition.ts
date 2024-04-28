import { Prisma } from "@lib/database/prisma";
import { Precondition } from "@sapphire/framework";
import { resolveKey } from "@sapphire/plugin-i18next";
import { Emojis } from "@shared/enum/misc/emojis.enum";
import { CommandInteraction, GuildMember } from "discord.js";

export class ChannelOwnerPrecondition extends Precondition {
    public async chatInputRun(interaction: CommandInteraction) {
        return this.processInteraction(interaction);
    }

    public async contextMenuRun(interaction: CommandInteraction) {
        return this.processInteraction(interaction);
    }

    private async processInteraction(interaction: CommandInteraction) {
        const member = interaction.member as GuildMember;
        const voiceChannel = member.voice.channel;

        if (!voiceChannel) {
            return this.error({ message: await resolveKey(interaction, 'commands/replies/commandDenied:not_in_voice_channel', { emoji: Emojis.ERROR }) });
        }

        const trustedUsers = await this.getTrustedUsers(interaction.guildId, voiceChannel.id);
        const isTrustedUser = trustedUsers.some(user => user.userId === interaction.user.id);
        const getChannel = await this.findChannel(interaction.guildId, voiceChannel.id);

        if (!getChannel) {
            return this.error({ message: await resolveKey(interaction, 'commands/replies/commandDenied:voice_not_found_in_db', { emoji: Emojis.ERROR }) });
        }

        if (interaction.user.id !== getChannel.channelOwnerId && !isTrustedUser) {
            return this.error({ message: await resolveKey(interaction, 'commands/replies/commandDenied:not_voice_channel_owner', { emoji: Emojis.ERROR }) });
        }

        return this.ok();
    }

    private async getTrustedUsers(guildId: string, channelId: string) {
        const users = await Prisma.voiceUsers.findMany({
            where: {
                guildId: guildId,
                channelId: channelId
            }
        });
        return users;
    }

    private async findChannel(guildId: string, channelId: string) {
        const channel = await Prisma.voices.findUnique({
            where: {
                guildId_channelId: {
                    guildId: guildId,
                    channelId: channelId
                }
            },
        });

        return channel;
    }
}
