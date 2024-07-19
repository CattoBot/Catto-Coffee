import { fetchT } from "@sapphire/plugin-i18next";
import { Subcommand } from "@sapphire/plugin-subcommands";
import { Emojis } from "../../../shared/enum/Emojis";
import { GuildMember, InteractionResponse, Message, PermissionFlagsBits, User } from "discord.js";
import { Args } from "@sapphire/framework";

export class VoiceRejectCommand {
    public static async messageRun(message: Message, args: Args) {
        await message.channel.sendTyping();
        const translateKey = await fetchT(message);

        const user = await args.pick('user').catch(() => null) as User | null;
        if (!user) {
            return message.reply(translateKey('commands/replies/commandDenied:voice_user_not_found'));
        }

        const member = message.guild?.members.resolve(user.id) as GuildMember | null;
        if (!member) {
            return message.reply(translateKey('commands/replies/commandDenied:voice_member_not_found'));
        }

        const memberVoiceChannel = member.voice.channel;
        const authorVoiceChannel = message.member?.voice.channel;

        if (!authorVoiceChannel) {
            return message.reply(translateKey('commands/replies/commandDenied:voice_author_not_in_channel'));
        }

        try {
            if (!memberVoiceChannel || authorVoiceChannel.id !== memberVoiceChannel.id) {
                await authorVoiceChannel.permissionOverwrites.edit(member.id, {
                    Connect: false,
                    ViewChannel: false
                });
            } else if (authorVoiceChannel.id === memberVoiceChannel.id) {
                await authorVoiceChannel.permissionOverwrites.edit(member.id, {
                    Connect: false,
                    ViewChannel: false
                });
                await member.voice.disconnect();
            }

            return message.reply({
                content: translateKey('commands/replies/voice:reject_success', { user: user.displayName, emoji: Emojis.SUCCESS })
            });
        } catch (error) {
            console.error('Error editing permission overwrites:', error);
            return message.reply(translateKey('commands/replies/commandDenied:voice_permission_error'));
        }
    }

    public static async chatInputRun(interaction: Subcommand.ChatInputCommandInteraction): Promise<InteractionResponse> {
        const translateKey = await fetchT(interaction);
        const user = interaction.options.getUser(translateKey('commands/options/voice:reject_name'));
        if (!user) {
            return interaction.reply({ content: translateKey('commands/replies/commandDenied:voice_user_not_found'), ephemeral: true });
        }

        const member = interaction.guild!.members.resolve(user.id) as GuildMember | null;
        const memberInteraction = interaction.guild!.members.resolve(interaction.user.id) as GuildMember | null;

        if (!member) {
            return interaction.reply({ content: translateKey('commands/replies/commandDenied:voice_member_not_found'), ephemeral: true });
        }

        if (member.permissions.has(PermissionFlagsBits.MuteMembers || PermissionFlagsBits.ManageMessages)) {
            return interaction.reply({
                content: 'You cannot reject members with moderation permissions.'
            })
        }

        if (interaction.user.id === user.id) {
            return interaction.reply({ content: translateKey('commands/replies/commandDenied:self_voice_command', { emoji: Emojis.ERROR }), ephemeral: true });
        }

        const memberVoiceChannel = member.voice.channel;
        const authorVoiceChannel = memberInteraction?.voice.channel;

        if (!authorVoiceChannel) {
            return interaction.reply({ content: translateKey('commands/replies/commandDenied:voice_author_not_in_channel'), ephemeral: true });
        }

        try {
            if (!memberVoiceChannel || memberVoiceChannel.id !== authorVoiceChannel.id) {
                await authorVoiceChannel.permissionOverwrites.edit(user.id, {
                    Connect: false,
                });
            } else {
                await authorVoiceChannel.permissionOverwrites.edit(user.id, {
                    Connect: false,
                });
                await member.voice.disconnect();
            }

            return interaction.reply({ content: translateKey('commands/replies/voice:reject_success', { user: user.displayName, emoji: Emojis.SUCCESS }) });
        } catch (error) {
            console.error('Error editing permission overwrites:', error);
            return interaction.reply({ content: translateKey('commands/replies/commandDenied:voice_permission_error'), ephemeral: true });
        }
    }
}
