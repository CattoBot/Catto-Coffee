import { Subcommand } from '@sapphire/plugin-subcommands';
import { ChatInputCommandInteraction } from 'discord.js';
import { container } from '@sapphire/pieces';
import { TextRankButtonRow, VoiceRankButtonOnly } from '../../../shared/bot/buttons/LevelingButtonts';
import { resolveKey } from '@sapphire/plugin-i18next';
import { LeaderboardImageBuilder } from '../../classes/LeaderboardCard';

export class LeaderboardCommand {
	public static async run(interaction: Subcommand.ChatInputCommandInteraction): Promise<void> {
		const guildId = interaction.guildId!;
		const voiceEnabled = await container.helpers.leveling.getVoiceXPEnabled(guildId);
		const textEnabled = await container.helpers.leveling.getTextXPEnabled(guildId);

		if (!voiceEnabled && !textEnabled) {
			await interaction.editReply({ content: await resolveKey(interaction, `commands/replies/level:rank_not_enabled`) });
			return;
		}

		if (voiceEnabled) {
			await this.generateVoiceLeaderboard(interaction);
		} else if (textEnabled) {
			await this.genreateChatLeaderboard(interaction);
		}
	}

	private static async generateVoiceLeaderboard(interaction: Subcommand.ChatInputCommandInteraction) {
		await interaction.deferReply();

		const guild_leaderboard = await container.helpers.leveling.getVoiceLeaderboard(interaction.guildId!);
		if (guild_leaderboard.length === 0) {
			await this.genreateChatLeaderboard(interaction);
			return;
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
		} else {
			await interaction.editReply({ content: await resolveKey(interaction, `commands/replies/level:lb_voice_user_not_data`) });
		}
	}

	static async genreateChatLeaderboard(interaction: ChatInputCommandInteraction) {
		await interaction.deferReply();
		const guild_leaderboard = await container.helpers.leveling.getTextLeaderboard(interaction.guildId!);
		if (guild_leaderboard.length === 0) {
			await interaction.editReply({ content: await resolveKey(interaction, `commands/replies/level:lb_not_data`) });
			return;
		}

		const userId = interaction.user.id;
		const builder = new LeaderboardImageBuilder()
			.setGuildLeaderboard(guild_leaderboard)
			.setUserId(userId)
			.setBackground('../../../assets/img/Leader_TXT.png')
			.setExperienceFormula(container.helpers.leveling.xp.textExperienceFormula)
			.setShowMessages(true)
			.setType('text');

		const buffer = await builder.build();
		if (buffer) {
			await interaction.editReply({ files: [{ attachment: buffer, name: 'leaderboard.png' }], components: [TextRankButtonRow] });
		} else {
			await interaction.editReply({ content: await resolveKey(interaction, `commands/replies/level:lb_voice_user_not_data`) });
		}

		return;
	}
}
