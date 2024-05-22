import { fetchT } from "@sapphire/plugin-i18next";
import { Subcommand } from "@sapphire/plugin-subcommands";
import { Emojis } from "../../../shared/enum/Emojis";
import { GuildMember, InteractionResponse, Message, User } from "discord.js";
import { Args } from "@sapphire/framework";

export class VoiceInviteCommand {
    public static async messageRun(message: Message, args: Args) {
        await message.channel.sendTyping();
        const translateKey = await fetchT(message);

        const user = await args.pick('user').catch(() => null) as User | null;
        if (!user) {
            return message.reply(translateKey('commands/replies/commandDenied:voice_user_not_found'));
        }

        const member = message.guild!.members.resolve(message.author.id) as GuildMember;

        if (member!.voice.channel!.members.has(user.id)) {
            return await message.reply(translateKey('commands/replies/voice:user_already_in_channel', { user: user.displayName, emoji: Emojis.WARN }));
        }

        if (message.author.id === user.id) {
            return message.reply(translateKey('commands/replies/commandDenied:self_voice_command', { emoji: Emojis.ERROR }));
        }

        const user_permissions = member!.voice.channel!.permissionOverwrites.resolve(user.id);

        try {
            await Promise.all([
                member!.voice.channel!.permissionOverwrites.edit(user.id, {
                    ...user_permissions,
                    Connect: true,
                    ViewChannel: true
                }).catch(err => {
                    console.error('Failed to edit permissions:', err);
                    throw new Error(translateKey('commands/replies/commandDenied:permission_edit_failed'));
                }),
                user.send(translateKey('commands/replies/voice:invite_dm', { guild: message.guild!.name, channel: member!.voice.channel!.url }))
                    .catch(() => {
                        message.reply(translateKey('commands/replies/commandDenied:invite_dm_failed', { emoji: Emojis.ERROR }));
                    })
            ]);

            return message.reply(translateKey('commands/replies/voice:invite_success', { user: user.username, emoji: Emojis.SUCCESS }));
        } catch (error) {
            console.error('Error during voice invite command:', error);
            return message.reply({ content: translateKey('commands/replies/commandDenied:unknown_error') });
        }
    }
    public static async chatInputRun(interaction: Subcommand.ChatInputCommandInteraction): Promise<InteractionResponse> {
        const translateKey = await fetchT(interaction);

        const user = interaction.options.getUser(translateKey('commands/options/voice:invite_name'));
        if (!user) {
            return interaction.reply({ content: translateKey('commands/replies/commandDenied:voice_user_not_found'), ephemeral: true });
        }

        const member = interaction.guild!.members.resolve(interaction.user.id) as GuildMember;

        if (member!.voice.channel!.members.has(interaction.user.id)) {
            return await interaction.reply({ content: translateKey('commands/replies/voice:user_already_in_channel', { user: interaction.user.displayName, emoji: Emojis.WARN }), ephemeral: true });
        }

        if (interaction.user.id === user.id) {
            return interaction.reply({ content: translateKey('commands/replies/commandDenied:self_voice_command', { emoji: Emojis.ERROR }), ephemeral: true });
        }

        const user_permissions = member!.voice.channel!.permissionOverwrites.resolve(user?.id);

        await Promise.all([
            member!.voice.channel!.permissionOverwrites.edit(user.id, {
                ...user_permissions,
                Connect: true,
                ViewChannel: true
            }),
            await user?.send({ content: translateKey('commands/replies/voice:invite_dm', { guild: interaction.guild!.name, channel: member!.voice.channel!.url }) }).catch(() => {
                return interaction.reply({ content: translateKey('commands/replies/commandDenied:invite_dm_failed', { emoji: Emojis.ERROR }), ephemeral: true });
            })
        ]);

        return interaction.reply({ content: translateKey('commands/replies/voice:invite_success', { user: user.displayName, emoji: Emojis.SUCCESS }) });
    }
}
