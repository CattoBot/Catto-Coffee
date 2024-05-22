import { container } from "@sapphire/pieces";
import { resolveKey } from "@sapphire/plugin-i18next";
import { Subcommand } from "@sapphire/plugin-subcommands";
import { VoiceChannel } from "discord.js";
import { Emojis } from "../../../shared/enum/Emojis";

export class VoiceBonusChannelCommand {
    public static async run(interaction: Subcommand.ChatInputCommandInteraction) {
        const channel = interaction.options.getChannel('channel', true) as VoiceChannel
        if (!channel) return interaction.reply({ content: await resolveKey(interaction, `commands/replies/error:invalid_channel`), ephemeral: true });

        await container.prisma.bonusVoiceChannels.create({
            data: {
                guildId: interaction.guild!.id,
                channelId: channel.id
            }
        })

        return await interaction.reply({ content: await resolveKey(interaction, `commands/replies/success:voice_bonus_channel_add`, { channel: channel, emoji: Emojis.SUCCESS }), ephemeral: false });
    }
}