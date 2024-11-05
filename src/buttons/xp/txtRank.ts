import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

const TextRankButtonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
        .setCustomId('txt-rank')
        .setLabel('Text Rank')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('1237904475704787066')
        .setDisabled(false),
    new ButtonBuilder()
        .setCustomId('vc-lb')
        .setLabel('Voice Leaderboard')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('1237904473980932107')
        .setDisabled(false)
);

export default TextRankButtonRow