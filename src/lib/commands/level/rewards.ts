import { Subcommand } from "@sapphire/plugin-subcommands";
import { ButtonInteraction } from 'discord.js';
import { RewardButtons } from "../../../shared/bot/buttons/LevelingButtonts";
import { Embed } from "../../classes/Embed";
import { RoleReward } from "../../../shared/types/Rewards";
import { resolveKey } from "@sapphire/plugin-i18next";
import { LevelingHelper } from "../../helpers/leveling.helper";
import { container } from "@sapphire/framework";
import { CattoSubcommandObject } from "../../../shared/types/Commands";

export class RewardsCommand extends LevelingHelper {
    public static async run(interaction: Subcommand.ChatInputCommandInteraction) {
        await interaction.deferReply({ ephemeral: false });
        const guildId = interaction.guildId!;
        const voiceEnabled = await container.helpers.leveling.getVoiceXPEnabled(guildId);
        const textEnabled = await container.helpers.leveling.getTextXPEnabled(guildId);

        if (!voiceEnabled && !textEnabled) {
            await interaction.followUp({ content: await resolveKey(interaction, `commands/replies/level:rank_not_enabled`), ephemeral: true });
            return;
        }

        const textRewards = await container.helpers.leveling.getTextRewards(guildId);
        const voiceRewards = await container.helpers.leveling.getVoiceRewards(guildId);

        if (textRewards.length === 0 && voiceRewards.length === 0) {
            await interaction.followUp({ content: await resolveKey(interaction, `commands/replies/level:not_rewards`), ephemeral: true });
        } else if (textRewards.length === 0 || !textEnabled) {
            await this.voiceRewardsResponse(interaction, voiceRewards);
        } else if (voiceRewards.length === 0 || !voiceEnabled) {
            await this.textRewardsResponse(interaction, textRewards);
        } else {
            await interaction.followUp({
                content: await resolveKey(interaction, `commands/replies/level:rewards_choose`),
                components: [RewardButtons]
            });

            const collector = interaction.channel?.createMessageComponentCollector({
                filter: (btnInteraction) => btnInteraction.user.id === interaction.user.id,
                time: 15000
            });

            collector?.on('collect', async (btnInteraction: ButtonInteraction) => {
                await btnInteraction.deferUpdate();
                if (btnInteraction.customId === 'text_rewards') {
                    await this.textRewardsResponse(btnInteraction, textRewards);
                } else if (btnInteraction.customId === 'voice_rewards') {
                    await this.voiceRewardsResponse(btnInteraction, voiceRewards);
                }
                collector.stop();
            });

        }
    }

    private static async textRewardsResponse(interaction: ButtonInteraction | Subcommand.ChatInputCommandInteraction, rewards: RoleReward[]) {
        const sortedRewards = rewards.sort((a, b) => a.level - b.level);
        const rewardStrings = sortedRewards.map(reward => `**Level** \`${reward.level}\`  ➜  <@&${reward.roleId}>`);
        return interaction.editReply({ embeds: [new Embed(rewardStrings.join('\n')).setTitle('Text Rewards')], components: [], content: '' });
    }

    private static async voiceRewardsResponse(interaction: ButtonInteraction | Subcommand.ChatInputCommandInteraction, rewards: RoleReward[]) {
        const sortedRewards = rewards.sort((a, b) => a.level - b.level);
        const rewardStrings = sortedRewards.map(reward => `**Level: ** \`${reward.level}\`  ➜  <@&${reward.roleId}>`);
        const icon = interaction.guild?.iconURL();
        return interaction.editReply({ embeds: [new Embed(rewardStrings.join('\n')).setTitle('Voice Rewards').setAuthor({ name: interaction.guild!.name, iconURL: icon! })], components: [], content: '' });
    }

    public static key:CattoSubcommandObject = {
        key: 'rewards'
    }
}
