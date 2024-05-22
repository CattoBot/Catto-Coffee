import { fetchT } from "@sapphire/plugin-i18next";
import { Subcommand } from "@sapphire/plugin-subcommands";
import { Emojis } from "../../../shared/enum/Emojis";
import { GuildMember, InteractionResponse, Message, User } from "discord.js";
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
        const authorVoiceChannel = message.member?.voice.channel!;

        try {
            if (!memberVoiceChannel || authorVoiceChannel.id !== memberVoiceChannel.id) {
                // User is either not in a voice channel or in a different voice channel
                await authorVoiceChannel.permissionOverwrites.edit(member.id, {
                    Connect: false,
                    ViewChannel: false
                });
            } else {
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
        const member = interaction.guild!.members.resolve(user!.id) as GuildMember;
        const member_interaction = interaction.guild!.members.resolve(interaction.user.id) as GuildMember;
        if (!user) {
            return interaction.reply({ content: translateKey('commands/replies/commandDenied:voice_user_not_found'), ephemeral: true });
        }

        if (interaction.user.id === user.id) {
            return interaction.reply({ content: translateKey('commands/replies/commandDenied:self_voice_command', { emoji: Emojis.ERROR }), ephemeral: true });
        }

        const user_permissions = member_interaction!.voice.channel!.permissionOverwrites.resolve(user?.id);

        if (!member.voice.channel || member.voice.channel.id !== member_interaction.voice.channelId) {
            await member.voice.channel!.permissionOverwrites.edit(user.id, {
                ...user_permissions,
                Connect: false,
            });
        } else {
            await member_interaction.voice.channel!.permissionOverwrites.edit(user.id, {
                Connect: false,
            });
            await member.voice.disconnect();
        }

        return interaction.reply({ content: translateKey('commands/replies/voice:reject_success', { user: user.displayName, emoji: Emojis.SUCCESS }) });
    }
}
