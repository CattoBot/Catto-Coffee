import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";

export const VoiceNameModalHandler = new ModalBuilder()
    .setCustomId("vc-name")
    .setTitle("Voice Channel Name")
    .addComponents(
        new ActionRowBuilder<TextInputBuilder>()
            .addComponents(
                new TextInputBuilder()
                    .setCustomId("voice-name")
                    .setLabel("Voice Channel Name")
                    .setRequired(true)
                    .setStyle(TextInputStyle.Paragraph)
                    .setMinLength(1)
                    .setMaxLength(60)
            )
    )