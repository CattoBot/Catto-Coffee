import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export const VoiceRankButtonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
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

export const TextRankButtonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
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

export const RewardButtons = new ActionRowBuilder<ButtonBuilder>()
.addComponents(
    new ButtonBuilder()
        .setCustomId('text_rewards')
        .setLabel('Show Text Rewards')
        .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
        .setCustomId('voice_rewards')
        .setLabel('Show Voice Rewards')
        .setStyle(ButtonStyle.Primary)
);

export const VoiceRankButtonOnly = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
        .setCustomId('vc-only-rank')
        .setLabel('Voice Rank')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('1237904473980932107')
        .setDisabled(false),
);