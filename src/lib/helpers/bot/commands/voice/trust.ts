import { Prisma } from "@lib/database/prisma";
import { fetchT } from "@sapphire/plugin-i18next";
import { Subcommand } from "@sapphire/plugin-subcommands";
import { Emojis } from "@shared/enum/misc/emojis.enum";
import { GuildMember, InteractionResponse } from "discord.js";

export class VoiceTrustCommand {
    private static prisma = new Prisma();

    public static async run(interaction: Subcommand.ChatInputCommandInteraction): Promise<InteractionResponse> {

        const translateKey = await fetchT(interaction);
        const user = interaction.options.getUser(translateKey('commands/options/voice:reject_name'));
        const member = interaction.guild.members.resolve(user.id) as GuildMember;
        const owner = interaction.guild.members.resolve(interaction.member.user.id) as GuildMember;

        if (!user) {
            return interaction.reply({ content: translateKey('commands/replies/commandDenied:voice_user_not_found'), ephemeral: true });
        }

        if (interaction.user.id === member.id) {
            return interaction.reply({ content: translateKey('commands/replies/commandDenied:self_voice_command', { emoji: Emojis.ERROR }), ephemeral: true });
        }

        if (this.find) {
            return interaction.reply({ content: translateKey('commands/replies/voice:already_trusted', { user: user.displayName, emoji: Emojis.ERROR }), ephemeral: true });
        }

        await this.store(member.voice.channelId, interaction.guild.id, member.id, owner.id)

        return interaction.reply({ content: translateKey('commands/replies/voice:trust_success', { user: user.displayName, emoji: Emojis.SUCCESS }) });
    }

    private static async find(channelId: string, userId: string): Promise<Boolean> {
        await this.prisma.trustedVoiceChannelMembers.findUnique({
            where: {
                id: channelId,
                userId: userId
            }
        })

        return true;
    }

    private static async store(channelId: string, userId: string, guildId: string, owner_id: string): Promise<void> {
        await this.prisma.trustedVoiceChannelMembers.create({ 
            data: {
                id: channelId,
                guildId: guildId,
                userId: userId,
                channelOwnerId: owner_id
            }
        })
    }
}
