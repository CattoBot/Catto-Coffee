import { Prisma, PrismaCoreModule } from "@lib/database/prisma";
import { VoiceUsers } from "@prisma/client";
import { fetchT } from "@sapphire/plugin-i18next";
import { Subcommand } from "@sapphire/plugin-subcommands";
import { Emojis } from "@shared/enum/misc/emojis.enum";
import { GuildMember, InteractionResponse } from "discord.js";

export class VoiceUntrustCommand {
    private static prisma: PrismaCoreModule = Prisma;

    public static async run(interaction: Subcommand.ChatInputCommandInteraction): Promise<InteractionResponse> {

        const translateKey = await fetchT(interaction);
        const user = interaction.options.getUser(translateKey('commands/options/voice:reject_name'));
        const member = interaction.guild.members.resolve(user.id) as GuildMember;
        const getOwner = await this.getVoiceChannelOwner(member.voice.channelId, interaction.guild.id)
        const owner = interaction.guild.members.resolve(getOwner) as GuildMember;

        if (interaction.member.user.id !== owner.id) {
            return await interaction.reply({ content: translateKey('commands/replies/commandDenied:only_vc_owner'), ephemeral: true });
        }

        if (!user) {
            return interaction.reply({ content: translateKey('commands/replies/commandDenied:voice_user_not_found'), ephemeral: true });
        }

        if (interaction.user.id === member.id) {
            return interaction.reply({ content: translateKey('commands/replies/commandDenied:self_voice_command', { emoji: Emojis.ERROR }), ephemeral: true });
        }

        const trustedUser = await this.find(owner.voice.channel.id, interaction.guild.id, member.id );

        if (!trustedUser) {
            return interaction.reply({ content: translateKey('commands/replies/voice:user_not_trusted', { user: user.displayName, emoji: Emojis.ERROR }), ephemeral: true });
        }

        await this.delete(owner.voice.channelId, member.id, interaction.guild.id).catch((err) => {
            console.log(err);
        });

        return interaction.reply({ content: translateKey('commands/replies/voice:untrust_success', { user: user.displayName, emoji: Emojis.SUCCESS }) });
    }

    private static async find(channelId: string, guildId: string, userId: string) {
        const user = await this.prisma.voiceUsers.findUnique({
            where: {
                guildId_channelId_userId: {
                    guildId: guildId, channelId: channelId, userId: userId
                }
            }
        })

        return user;
    }

    private static async delete(channelId: string, userId: string, guildId: string): Promise<VoiceUsers> {
        return await this.prisma.voiceUsers.delete({
            where: {
                guildId_channelId_userId: {
                    guildId: guildId, channelId: channelId, userId: userId
                }
            }
        })
    }

    private static async getVoiceChannelOwner(channelId: string, guildId: string) {
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
