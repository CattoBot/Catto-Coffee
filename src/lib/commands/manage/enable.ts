import { container } from '@sapphire/pieces';
import { resolveKey } from '@sapphire/plugin-i18next';
import { Subcommand } from '@sapphire/plugin-subcommands';
import { Emojis } from '../../../shared/enum/Emojis';
import { AllowedCommand, allowedCommands } from '../../../shared/types/Commands';

export class EnableCommand {
	public static async commandRun(interaction: Subcommand.ChatInputCommandInteraction) {
		const command = interaction.options.getString('command', true) as AllowedCommand;
		if (!allowedCommands.includes(command)) {
			return await interaction.reply({
				content: await resolveKey(interaction, `commands/replies/error:invalid_command`, { emoji: Emojis.ERROR }),
				ephemeral: true
			});
		}

		const disabledCommand = await container.prisma.disabled_commands.findUnique({
			where: {
				guildId_command: {
					guildId: interaction.guild!.id,
					command: command
				}
			}
		});

		if (!disabledCommand) {
			return await interaction.reply({
				content: await resolveKey(interaction, `commands/replies/error:already_enabled_command`, { emoji: Emojis.ERROR }),
				ephemeral: true
			});
		}

		await container.prisma.disabled_commands.delete({
			where: {
				guildId_command: {
					guildId: interaction.guild!.id,
					command: command
				}
			}
		});

		return await interaction.reply({
			content: await resolveKey(interaction, `commands/replies/admin:enable_command`, { command: command, emoji: Emojis.SUCCESS }),
			ephemeral: false
		});
	}

	public static async moduleRun(interaction: Subcommand.ChatInputCommandInteraction) {
		const module = interaction.options.getString('module', true);
		const disabledModule = await container.prisma.disabled_modules.findUnique({
			where: {
				guildId_module: {
					guildId: interaction.guild!.id,
					module: module
				}
			}
		});

		if (!disabledModule) {
			return await interaction.reply({
				content: await resolveKey(interaction, `commands/replies/error:already_enabled_module`, { emoji: Emojis.ERROR }),
				ephemeral: true
			});
		}

		if (module === 'voicexp') {
			await container.prisma.i_voice_experience.update({ where: { guildId: interaction.guild!.id }, data: { isEnabled: true } });
			await container.redis.del(`guild:${interaction.guild!.id}:voiceXPEnabled`);
		} else if (module === 'textxp') {
			await container.prisma.i_text_experience.update({ where: { guildId: interaction.guild!.id }, data: { isEnabled: true } });
			await container.redis.del(`guild:${interaction.guild!.id}:textXPEnabled`);
		}

		await container.prisma.disabled_modules.delete({
			where: {
				guildId_module: {
					guildId: interaction.guild!.id,
					module: module
				}
			}
		});

		return await interaction.reply({
			content: await resolveKey(interaction, `commands/replies/admin:enable_module`, { module: module, emoji: Emojis.SUCCESS }),
			ephemeral: false
		});
	}
}
