import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

const RewardButtons = new ActionRowBuilder<ButtonBuilder>()
.addComponents(
    new ButtonBuilder()
        .setCustomId('text_rewards')
        .setLabel('Text Rewards')
        .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
        .setCustomId('voice_rewards')
        .setLabel('Voice Rewards')
        .setStyle(ButtonStyle.Primary)
);

export default RewardButtons