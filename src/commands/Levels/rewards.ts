import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command } from '@sapphire/framework';
import { resolveKey } from '@sapphire/plugin-i18next';
import { ButtonInteraction, CommandInteraction, Message } from 'discord.js';
import { LevelingHelper } from '../../lib/helpers/leveling.helper';
import { RewardButtons } from '../../shared/bot/buttons/LevelingButtonts';
import { RoleReward } from '../../shared/types/Rewards';
import { Embed } from '../../lib/classes/Embed';
import { Time } from '@sapphire/time-utilities';

@ApplyOptions<Command.Options>({
    description: 'Check the server leaderboard.',
    aliases: ['rw'],
    cooldownDelay: Time.Second * 10
})
export class RankLeaderboardCommand extends Command {
    public override async messageRun(message: Message, _args: Args) {
        await this.run(message, message.author.id, message.guildId!);
    }

    public override async chatInputRun(interaction: CommandInteraction) {
        await this.run(interaction, interaction.user.id, interaction.guildId!);
    }

    private async run(context: Message | CommandInteraction, userId: string, guildId: string) {
        if (context instanceof Message) {
            await context.channel.sendTyping();
        } else {
            await context.deferReply();
        }

        const voiceEnabled = await LevelingHelper.getVoiceXPEnabled(guildId);
        const textEnabled = await LevelingHelper.getTextXPEnabled(guildId);

        if (!voiceEnabled && !textEnabled) {
            const content = await resolveKey(context, `commands/replies/level:rank_not_enabled`);
            await this.respond(context, { content });
            return;
        }

        const textRewards = await LevelingHelper.getTextRewards(guildId);
        const voiceRewards = await LevelingHelper.getVoiceRewards(guildId);

        if (textRewards.length === 0 && voiceRewards.length === 0) {
            const content = await resolveKey(context, `commands/replies/level:not_rewards`);
            await this.respond(context, { content });
        } else if (textRewards.length === 0 || !textEnabled) {
            await this.voiceRewardsResponse(context, voiceRewards);
        } else if (voiceRewards.length === 0 || !voiceEnabled) {
            await this.textRewardsResponse(context, textRewards);
        } else {
            const content = await resolveKey(context, `commands/replies/level:rewards_choose`);
            await this.respond(context, {
                content,
                components: [RewardButtons]
            });

            const collector = context.channel?.createMessageComponentCollector({
                filter: (btnInteraction) => btnInteraction.user.id === userId,
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

    private async textRewardsResponse(context: Message | ButtonInteraction | CommandInteraction, rewards: RoleReward[]) {
        const sortedRewards = rewards.sort((a, b) => a.level - b.level);
        const rewardStrings = sortedRewards.map(reward => `**Level: ** \`${reward.level}\`  ➜  <@&${reward.roleId}>`);
        const icon = context.guild?.iconURL();
        const embed = new Embed(rewardStrings.join('\n')).setTitle('Text Rewards').setAuthor({name: context.guild!.name, iconURL: icon!});
        await this.respond(context, { embeds: [embed], components: [], content: '' });
    }

    private async voiceRewardsResponse(context: Message | ButtonInteraction | CommandInteraction, rewards: RoleReward[]) {
        const sortedRewards = rewards.sort((a, b) => a.level - b.level);
        const rewardStrings = sortedRewards.map(reward => `**Level: ** \`${reward.level}\`  ➜  <@&${reward.roleId}>`);
        const icon = context.guild?.iconURL();
        const embed = new Embed(rewardStrings.join('\n')).setTitle('Voice Rewards').setAuthor({name: context.guild!.name, iconURL: icon!});
        await this.respond(context, { embeds: [embed], components: [], content: '' });
    }

    private async respond(context: Message | CommandInteraction | ButtonInteraction, options: any) {
        if (context instanceof Message) {
            await context.reply(options);
        } else {
            await context.editReply(options);
        }
    }
}
