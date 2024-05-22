import { container } from "@sapphire/pieces";
import { resolveKey } from "@sapphire/plugin-i18next";
import { Subcommand } from "@sapphire/plugin-subcommands";
import { Emojis } from "../../../shared/enum/Emojis";
import { InteractionResponse, Message } from "discord.js";
import { VoiceHelper } from "../../helpers/voice.helper";

export class VoiceClaimCommand extends VoiceHelper {

    public static async messageRun(message: Message) {
        await message.channel.sendTyping();
        const member = message.member;
        if (!member!.voice.channel) {
            return message.reply({
                content: (await resolveKey(message, `commands/replies/commandDenied:voice_channel_not_found`, { emoji: Emojis.ERROR })),
            });
        }

        const channel = await this.find(member!.voice.channel.id, message.guild!.id);

        if (channel!.channelOwnerId === member!.id) {
            return message.reply({
                content: (await resolveKey(message, `commands/replies/commandDenied:already_owner`, { emoji: Emojis.ERROR })),
            });
        }

        if (member!.voice.channel.members.has(channel!.channelOwnerId)) {
            return message.reply({
                content: (await resolveKey(message, `commands/replies/voice:claim_error`, { emoji: Emojis.ERROR })),
            });
        } else {
            await container.prisma.voiceTempChannels.update({
                where: {
                    guildId_channelId: {
                        channelId: message.guild!.id,
                        guildId: member!.voice.channel.id,
                    },
                },
                data: {
                    channelOwnerId: member!.id,
                },
            });

            return message.reply({
                content: (await resolveKey(message, `commands/replies/voice:claim_success`, { emoji: Emojis.SUCCESS })),
            });
        }
    }
    public static async chatInputRun(interaction: Subcommand.ChatInputCommandInteraction): Promise<InteractionResponse> {
        const user = interaction.user.id;
        const member = interaction.guild!.members.resolve(user);
        const channel = await this.find(member!.voice.channel!.id, interaction.guild!.id);

        if (channel!.channelOwnerId === member!.id) {
            return interaction.reply({
                content: (await resolveKey(interaction, `commands/replies/commandDenied:already_owner`, { emoji: Emojis.ERROR })),
                ephemeral: true,
            });
        }

        if (member!.voice.channel!.members.has(channel!.channelOwnerId)) {
            return interaction.reply({
                content: (await resolveKey(interaction, `commands/replies/voice:claim_error`, { emoji: Emojis.ERROR })),
                ephemeral: true,
            });
        } else {
            await container.prisma.voiceTempChannels.update({
                where: {
                    guildId_channelId: {
                        channelId: interaction.guild!.id,
                        guildId: member!.voice.channel!.id,
                    },
                },
                data: {
                    channelOwnerId: member!.id,
                },
            });

            return interaction.reply({
                content: (await resolveKey(interaction, `commands/replies/voice:claim_success`, { emoji: Emojis.SUCCESS })),
                ephemeral: true
            });
        }
    }
}