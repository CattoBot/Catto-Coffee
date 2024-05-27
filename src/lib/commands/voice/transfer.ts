import { container } from "@sapphire/pieces";
import { fetchT, resolveKey } from "@sapphire/plugin-i18next";
import { Subcommand } from "@sapphire/plugin-subcommands";
import { Emojis } from "../../../shared/enum/Emojis";
import { GuildMember, InteractionResponse, Message, User } from "discord.js";
import { Args } from "@sapphire/framework";

export class VoiceTransferCommand {
    public static async messageRun(message: Message, args: Args) {
        await message.channel.sendTyping();
        const translateKey = await fetchT(message);

        const user = await args.pick('user').catch(() => null) as User | null;
        if (!user) {
            return message.reply(translateKey('commands/replies/commandDenied:voice_user_not_found'));
        }

        const member = message.guild!.members.resolve(user.id);
        if (!member) {
            return message.reply(translateKey('commands/replies/commandDenied:voice_member_not_found'));
        }

        if (!message.member!.voice.channel) {
            return message.reply(translateKey('commands/replies/commandDenied:not_in_voice_channel'));
        }
    
        try {
            await container.prisma.voice_temp_channels.update({
                where: {
                    guildId_channelId: {
                        channelId: message.member!.voice.channel!.id,
                        guildId: message.guild!.id
                    }
                },
                data: {
                    channelOwnerId: member.id
                }
            });
        } catch (error) {
            container.console.error(error);
            return message.reply(await resolveKey(message, 'commands/replies/error:error', { user: user.displayName, emoji: Emojis.ERROR }));
        }
    
        return message.reply(await resolveKey(message, 'commands/replies/voice:transfer_success', { user: user.displayName, emoji: Emojis.SUCCESS }));
    }
    

    public static async chatInputRun(interaction: Subcommand.ChatInputCommandInteraction): Promise<InteractionResponse> {
        const translateKey = await fetchT(interaction);
        const user = interaction.options.getUser(translateKey('commands/options/voice:reject_name'));
        const member = interaction.guild!.members.resolve(user!.id) as GuildMember;

        try {
            await container.prisma.voice_temp_channels.update({
                where: {
                    guildId_channelId: {
                        channelId: member.voice.channel!.id,
                        guildId: interaction.guild!.id
                    }
                }, data: {
                    channelOwnerId: member.id
                }
            })
        } catch (error) {
            container.console.error(error);
            return interaction.reply({ content: (await resolveKey(interaction, 'commands/replies/error:error', { user: user!.displayName, emoji: Emojis.ERROR })), ephemeral: true });
        }


        return await interaction.reply({ content: (await resolveKey(interaction, `commands/replies/voice:transfer_success`, { user: user!.displayName, emoji: Emojis.SUCCESS })), });
    }
}
