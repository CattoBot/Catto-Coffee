import { Prisma, PrismaCoreModule } from "@lib/database/prisma";
import { Precondition } from "@sapphire/framework";
import { resolveKey } from "@sapphire/plugin-i18next";
import { Emojis } from "@shared/enum/misc/emojis.enum";
import { CommandInteraction, GuildMember } from "discord.js";

export class ChannelClaimPrecondition extends Precondition {
    private prisma: PrismaCoreModule = Prisma;
    public async chatInputRun(interaction: CommandInteraction) {
        const member = interaction.guild.members.resolve(interaction.user.id) as GuildMember;
        const ownerId = await this.getVoiceChannelOwner(member.voice.channel.id, interaction.guild.id);

        if (member.voice.channel.members.has(ownerId)) {
            return this.error({ message: await resolveKey(interaction, `commands/replies/voice:owner_in_voice_channel`, { emoji: Emojis.ERROR }) });
        }

        return this.ok();
    }

    private async getVoiceChannelOwner(channelId: string, guildId: string) {
        const owner = await this.prisma.voices.findUnique({
            where: {
                guildId_channelId: {
                    guildId: guildId,
                    channelId: channelId,
                }
            }
        })
        return owner.channelOwnerId;
    }
}