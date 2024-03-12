import { fetchT } from "@sapphire/plugin-i18next";
import { Subcommand } from "@sapphire/plugin-subcommands";
import { Emojis } from "@shared/enum/misc/emojis.enum";
import { GuildMember, InteractionResponse } from "discord.js";

export class VoicePermitCommand {
    public static async run(interaction: Subcommand.ChatInputCommandInteraction): Promise<InteractionResponse> {
        const translateKey = await fetchT(interaction);
        const user = interaction.options.getUser(translateKey('commands/options/voice:reject_name'));
        const member = interaction.guild.members.resolve(user.id) as GuildMember;
        const member_interaction = interaction.guild.members.resolve(interaction.user.id) as GuildMember;
        if (!user) {
            return interaction.reply({ content: translateKey('commands/replies/commandDenied:voice_user_not_found'), ephemeral: true });
        }

        if (interaction.user.id === user.id) {
            return interaction.reply({ content: translateKey('commands/replies/commandDenied:self_voice_command', { emoji: Emojis.ERROR }), ephemeral: true });
        }

        const user_permissions = member?.voice.channel.permissionOverwrites.resolve(user?.id);

        if (member.voice.channel.id !== member.voice.channelId) {
            await member.voice.channel.permissionOverwrites.edit(user.id, {
                ...user_permissions,
                ViewChannel: true,
                Connect: true,
            });
        } else {
            await member_interaction.voice.channel.permissionOverwrites.edit(user.id, {
                Connect: true,
            });
        }

        return interaction.reply({ content: translateKey('commands/replies/voice:permit_success', { user: user.displayName, emoji: Emojis.SUCCESS }) });
    }
}
