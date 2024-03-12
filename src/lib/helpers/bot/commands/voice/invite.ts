import { fetchT } from "@sapphire/plugin-i18next";
import { Subcommand } from "@sapphire/plugin-subcommands";
import { Emojis } from "@shared/enum/misc/emojis.enum";
import { GuildMember, InteractionResponse } from "discord.js";

export class VoiceInviteCommand {
    public static async run(interaction: Subcommand.ChatInputCommandInteraction): Promise<InteractionResponse> {
        const translateKey = await fetchT(interaction);
        
        const user = interaction.options.getUser(translateKey('commands/options/voice:invite_name'));
        if (!user) {
            return interaction.reply({ content: translateKey('commands/replies/commandDenied:voice_user_not_found'), ephemeral: true });
        }

        const member = interaction.guild.members.resolve(interaction.user.id) as GuildMember;

        if (interaction.user.id === user.id) {
            return interaction.reply({ content: translateKey('commands/replies/commandDenied:self_voice_command', { emoji: Emojis.ERROR }), ephemeral: true });
        }

        const user_permissions = member?.voice.channel.permissionOverwrites.resolve(user?.id);

        await Promise.all([
            member?.voice.channel.permissionOverwrites.edit(user.id, {
                ...user_permissions,
                Connect: true,
                ViewChannel: true
            }),
            await user?.send({ content: translateKey('commands/replies/voice:invite_dm', { guild: interaction.guild.name, channel: member?.voice.channel.url }) }).catch(error => {
               return interaction.reply({ content: translateKey('commands/replies/commandDenied:invite_dm_failed', { emoji: Emojis.ERROR }), ephemeral: true });
            })
        ]);

        return interaction.reply({ content: translateKey('commands/replies/voice:invite_success', { user: user.displayName, emoji: Emojis.SUCCESS }) });
    }
}
