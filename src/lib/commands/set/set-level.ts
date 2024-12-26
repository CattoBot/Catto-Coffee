import { container } from '@sapphire/pieces';
import { ChatInputCommandInteraction, GuildMember } from 'discord.js';
import { Emojis } from '../../../shared/enum/Emojis';

export class SetLevelCommand {
	public static async chatInputText(interaction: ChatInputCommandInteraction) {
		await this.handleTextLevelSetting(interaction);
	}

	public static async chatInputVoice(interaction: ChatInputCommandInteraction) {
		await this.handleVoiceLevelSetting(interaction);
	}

	private static async handleTextLevelSetting(interaction: ChatInputCommandInteraction) {
		await interaction.deferReply();

		const user = interaction.options.getUser('user', true);
		const level = interaction.options.getNumber('level', true);

		if (level < 1 || level > 500) {
			return interaction.reply(`Level must be between 1 and 500 ${Emojis.ERROR}`);
		}

		try {
			await container.prisma.text_experience.update({
				where: {
					guildId_userId: {
						guildId: interaction.guildId!,
						userId: user.id
					}
				},
				data: {
					textLevel: level,
					textExperience: 0
				}
			});
		} catch (error) {
			await container.prisma.text_experience.create({
				data: {
					guildId: interaction.guildId!,
					userId: user.id,
					textLevel: level,
					textExperience: 0
				}
			});
		}

		const member = await interaction.guild!.members.fetch(user.id);
		await this.assignRoles(member, interaction.guildId!, 'text', level).catch(() =>
			interaction.editReply(
				`Successfully set ${user.username}'s level to \`${level}\` ${Emojis.SUCCESS}, but the roles could not be added due to a role hierarchy issue. Please make sure the bot has the correct permissions to add roles. ${Emojis.ERROR}`
			)
		);

		return interaction.editReply(`Successfully set ${user.username}'s level to \`${level}\` ${Emojis.SUCCESS}`);
	}

	private static async handleVoiceLevelSetting(interaction: ChatInputCommandInteraction) {
		await interaction.deferReply();

		const user = interaction.options.getUser('user', true);
		const level = interaction.options.getNumber('level', true);

		if (level < 1 || level > 500) {
			return interaction.reply(`Level must be between 1 and 500 ${Emojis.ERROR}`);
		}

		try {
			await container.prisma.voice_experience.update({
				where: {
					guildId_userId: {
						guildId: interaction.guildId!,
						userId: user.id
					}
				},
				data: {
					voiceLevel: level,
					voiceExperience: 0
				}
			});
		} catch (error) {
			await container.prisma.voice_experience.create({
				data: {
					guildId: interaction.guildId!,
					userId: user.id,
					voiceLevel: level,
					voiceExperience: 0
				}
			});
		}

		const member = await interaction.guild!.members.fetch(user.id);
		await this.assignRoles(member, interaction.guildId!, 'voice', level).catch(() =>
			interaction.editReply(
				`Successfully set ${user.username}'s level to \`${level}\` ${Emojis.SUCCESS}, but the roles could not be added due to a role hierarchy issue. Please make sure the bot has the correct permissions to add roles. ${Emojis.ERROR}`
			)
		);

		return interaction.editReply(`Successfully set ${user.username}'s level to \`${level}\` ${Emojis.SUCCESS}`);
	}

	private static async assignRoles(member: GuildMember, guildID: string, type: 'text' | 'voice', level: number): Promise<void> {
		const rolesForLevel = await container.prisma.experience_role_rewards.findMany({
			where: {
				guildId: guildID,
				level: { lte: level },
				roleType: type
			}
		});

		const roleIdsForLevel = new Set(rolesForLevel.map((role) => role.roleId));
		const currentRoleIds = new Set(member.roles.cache.keys());
		const rolesToAssign = Array.from(member.guild.roles.cache.values()).filter(
			(role) => roleIdsForLevel.has(role.id) && !currentRoleIds.has(role.id)
		);

		if (rolesToAssign.length > 0) {
			await member.roles.add(rolesToAssign).catch(() => null);
		}
	}
}
