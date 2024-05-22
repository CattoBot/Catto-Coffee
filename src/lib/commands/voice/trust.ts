import { fetchT, resolveKey } from "@sapphire/plugin-i18next";
import { Subcommand } from "@sapphire/plugin-subcommands";
import { Emojis } from "../../../shared/enum/Emojis";
import { GuildMember, InteractionResponse, Message, User } from "discord.js";
import { VoiceHelper } from "../../helpers/voice.helper";
import { Args } from "@sapphire/framework";

export class VoiceTrustCommand extends VoiceHelper {
    public static async messageRun(message: Message, args: Args) {
        await message.channel.sendTyping();
        try {
            const member = message.member as GuildMember;
            const getOwner = await this.getVoiceChannelOwner(member.voice.channelId!, message.guild!.id);
            const owner = message.guild!.members.resolve(getOwner) as GuildMember;

            let user: User | undefined;
            try {
                user = await args.pick('user');
            } catch {
                await message.reply({ content: await resolveKey(message, 'commands/replies/commandDenied:voice_user_not_found') });
                return;
            }

            if (message.member!.user.id !== owner.id) {
                return message.reply({ content: await resolveKey(message, 'commands/replies/commandDenied:only_vc_owner') });
            }

            if (!user) {
                return message.reply({ content: await resolveKey(message, 'commands/replies/commandDenied:voice_user_not_found') });
            }

            if (message.member!.user.id === user.id) {
                return message.reply({ content: await resolveKey(message, 'commands/replies/commandDenied:self_voice_command', { emoji: Emojis.ERROR }) });
            }

            const trustedUser = await this.findTrusted(owner.voice.channel!.id, message.guild!.id, user.id);

            if (trustedUser) {
                return message.reply({ content: await resolveKey(message, 'commands/replies/voice:already_trusted', { user: user.displayName, emoji: Emojis.ERROR }) });
            } else {
                try {
                    await this.store(owner.voice.channelId!, user.id, message.guild!.id);
                    return message.reply({ content: await resolveKey(message, 'commands/replies/voice:trust_success', { user: user.displayName, emoji: Emojis.SUCCESS }) });
                } catch (err) {
                    console.error('Error storing trusted user:', err);
                    return message.reply({ content: 'An error occurred while trying to store the trusted user. Please try again later.' });
                }
            }
        } catch (error) {
            console.error('Error in voice invite command:', error);
            return message.reply({ content: 'An unexpected error occurred. Please try again later.' });
        }
    }

    public static async chatInputRun(interaction: Subcommand.ChatInputCommandInteraction): Promise<InteractionResponse> {

        const translateKey = await fetchT(interaction);
        const user = interaction.options.getUser(translateKey('commands/options/voice:reject_name'));
        const member = interaction.guild!.members.resolve(user!.id) as GuildMember;
        const getOwner = await this.getVoiceChannelOwner(member.voice.channelId!, interaction.guild!.id)
        const owner = interaction.guild!.members.resolve(getOwner) as GuildMember;


        if (interaction.member!.user.id !== owner.id) {
            return await interaction.reply({ content: translateKey('commands/replies/commandDenied:only_vc_owner'), ephemeral: true });
        }

        if (!member) {
            return await interaction.reply({ content: translateKey('commands/replies/commandDenied:voice_user_not_found'), ephemeral: true });
        }

        if (interaction.user.id === member.id) {
            return await interaction.reply({ content: translateKey('commands/replies/commandDenied:self_voice_command', { emoji: Emojis.ERROR }), ephemeral: true });
        }

        const trustedUser = await this.findTrusted(owner.voice.channel!.id, interaction.guild!.id, member.id);

        if (trustedUser) {
            return await interaction.reply({ content: translateKey('commands/replies/voice:already_trusted', { user: user!.displayName, emoji: Emojis.ERROR }), ephemeral: true });
        } else {
            await this.store(owner.voice.channelId!, member.id, interaction.guild!.id).catch((err) => {
                console.log(err);
            });

            return await interaction.reply({ content: translateKey('commands/replies/voice:trust_success', { user: user!.displayName, emoji: Emojis.SUCCESS }) });
        }
    }
}
