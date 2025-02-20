import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import { container } from '@sapphire/framework';
import type { ButtonInteraction } from 'discord.js';
import { CheckVoiceExperienceEnabled } from '../../lib/decorators/InteractionVoiceExpEnabled';
import { VoiceRankButtonOnly } from '../../shared/bot/buttons/LevelingButtonts';
import { resolveKey } from '@sapphire/plugin-i18next';
import { ButtonCooldown } from '../../lib/decorators/HandlersCooldown';
import { LeaderboardImageBuilder } from '../../lib/classes/LeaderboardCard';

export class ButtonVoiceLeaderboardHandler extends InteractionHandler {
	public constructor(ctx: InteractionHandler.LoaderContext, options: InteractionHandler.Options) {
		super(ctx, {
			...options,
			interactionHandlerType: InteractionHandlerTypes.Button
		});
	}

	public override parse(interaction: ButtonInteraction) {
		if (interaction.customId !== 'vc-lb') return this.none();
		return this.some();
	}

	@CheckVoiceExperienceEnabled
	@ButtonCooldown(60)
	public async run(interaction: ButtonInteraction) {
		try {
			await interaction.deferReply();

			const guild_leaderboard = await this.container.helpers.leveling.getVoiceLeaderboard(interaction.guildId!);
			if (guild_leaderboard.length === 0) {
				return await interaction.editReply({ content: await resolveKey(interaction, `commands/replies/level:lb_not_data`) });
			}

			const userId = interaction.user.id;
			const builder = new LeaderboardImageBuilder()
				.setGuildLeaderboard(guild_leaderboard)
				.setUserId(userId)
				.setBackground('../../../assets/img/Leader_VC_v2.jpg')
				.setExperienceFormula(container.helpers.leveling.xp.experienceFormula)
				.setShowHours(true)
				.setType('voice');

			const buffer = await builder.build();
			if (buffer) {
				await interaction.editReply({ files: [{ attachment: buffer, name: 'leaderboard.png' }], components: [VoiceRankButtonOnly] });
				return;
			} else {
				await interaction.editReply({ content: await resolveKey(interaction, `commands/replies/level:lb_voice_user_not_data`) });
				return;
			}
		} catch (error) {
			this.container.logger.error(`Error in ButtonVoiceLeaderboardHandler: ${error}`);
			await interaction.editReply({ content: 'An error occurred while processing your request. Please try again later.' });
			return;
		}
	}
}
