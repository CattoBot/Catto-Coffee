import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

const VoiceRankButtonOnly = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
        .setCustomId('vc-only-rank')
        .setLabel('Voice Rank')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('1237904473980932107')
        .setDisabled(false),
);

export default VoiceRankButtonOnly