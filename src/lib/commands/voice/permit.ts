import { fetchT } from "@sapphire/plugin-i18next";
import { Subcommand } from "@sapphire/plugin-subcommands";
import { Emojis } from "../../../shared/enum/Emojis";
import { GuildMember, InteractionResponse, Message, User } from "discord.js";
import { Args } from "@sapphire/framework";

export class VoicePermitCommand {
    public static async messageRun(message: Message, args: Args) {
        await message.channel.sendTyping();
        const translateKey = await fetchT(message);

        const user = await args.pick('user').catch(() => null) as User | null;
        if (!user) {
            return message.reply(translateKey('commands/replies/commandDenied:voice_user_not_found'));
        }

        const member = message.guild?.members.resolve(user.id) as GuildMember | null;
        const authorMember = message.guild?.members.resolve(message.author.id) as GuildMember | null;

        if (!authorMember || !authorMember.voice.channel) {
            return message.reply(translateKey('commands/replies/commandDenied:voice_author_not_in_channel'));
        }

        if (!member || !member.voice.channel) {
            return message.reply(translateKey('commands/replies/commandDenied:voice_user_not_in_channel'));
        }

        try {
            if (authorMember.voice.channel.id !== member.voice.channel.id) {
                await authorMember.voice.channel.permissionOverwrites.edit(user.id, {
                    Connect: true,
                    ViewChannel: true
                });
            } else {
                await authorMember.voice.channel.permissionOverwrites.edit(user.id, {
                    Connect: true,
                    ViewChannel: true
                });
            }

            return message.reply({
                content: translateKey('commands/replies/voice:permit_success', { user: user.displayName, emoji: Emojis.SUCCESS })
            });
        } catch (error) {
            console.error('Error editing permission overwrites:', error);
            return message.reply(translateKey('commands/replies/commandDenied:voice_permission_error'));
        }
    }

    public static async run(interaction: Subcommand.ChatInputCommandInteraction): Promise<InteractionResponse> {
        const translateKey = await fetchT(interaction);
        const user = interaction.options.getUser(translateKey('commands/options/voice:reject_name'));
        if (!user) {
            return interaction.reply({ content: translateKey('commands/replies/commandDenied:voice_user_not_found'), ephemeral: true });
        }

        const member = interaction.guild?.members.resolve(user.id) as GuildMember | null;
        const memberInteraction = interaction.guild?.members.resolve(interaction.user.id) as GuildMember | null;

        if (!memberInteraction || !memberInteraction.voice.channel) {
            return interaction.reply({ content: translateKey('commands/replies/commandDenied:voice_author_not_in_channel'), ephemeral: true });
        }

        if (!member || !member.voice.channel) {
            return interaction.reply({ content: translateKey('commands/replies/commandDenied:voice_user_not_in_channel'), ephemeral: true });
        }

        try {
            const userPermissions = member.voice.channel.permissionOverwrites.resolve(user.id);

            if (memberInteraction.voice.channel.id !== member.voice.channel.id) {
                await memberInteraction.voice.channel.permissionOverwrites.edit(user.id, {
                    ...userPermissions,
                    ViewChannel: true,
                    Connect: true,
                });
            } else {
                await memberInteraction.voice.channel.permissionOverwrites.edit(user.id, {
                    ViewChannel: true,
                    Connect: true,
                });
            }

            return interaction.reply({
                content: translateKey('commands/replies/voice:permit_success', { user: user.displayName, emoji: Emojis.SUCCESS })
            });
        } catch (error) {
            console.error('Error editing permission overwrites:', error);
            return interaction.reply({ content: translateKey('commands/replies/commandDenied:voice_permission_error'), ephemeral: true });
        }
    }
}
