import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

const VoiceRankButtonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
        .setCustomId('vc-rank')
        .setLabel('Voice Rank')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('1237904473980932107')
        .setDisabled(false),
    new ButtonBuilder()
        .setCustomId('text-lb')
        .setLabel('Text Leaderboard')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('1237904475704787066')
        .setDisabled(false)
);

export default VoiceRankButtonRow