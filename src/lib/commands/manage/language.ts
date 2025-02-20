import { container } from '@sapphire/pieces';
import { resolveKey } from '@sapphire/plugin-i18next';
import { Subcommand } from '@sapphire/plugin-subcommands';
import { Emojis } from '../../../shared/enum/Emojis';
import { Message } from 'discord.js';

export class LanguageCommand {
	public static async chatInputRun(interaction: Subcommand.ChatInputCommandInteraction) {
		const language = interaction.options.getString('language', true);
		const currentLang = await container.prisma.guilds.findUnique({
			where: {
				guildId: interaction.guild!.id
			}
		});
		if (currentLang?.language === language)
			return interaction.reply({
				content: await resolveKey(interaction, `commands/replies/error:language_same`, { emoji: Emojis.ERROR }),
				ephemeral: true
			});

		await container.prisma.guilds.update({
			where: {
				guildId: interaction.guild!.id
			},
			data: {
				language: language
			}
		});

		return await interaction.reply({
			content: await resolveKey(interaction, `commands/replies/admin:language_update`, { language: language, emoji: Emojis.SUCCESS }),
			ephemeral: false
		});
	}

	public static async messageRun(message: Message) {
		const language = message.content.split(' ')[1];
		if (!language)
			return message.reply({ content: await resolveKey(message, `commands/replies/error:invalid_language`, { emoji: Emojis.ERROR }) });
		if (language.length > 5)
			return message.reply({ content: await resolveKey(message, `commands/replies/error:language_length`, { emoji: Emojis.ERROR }) });
		await container.prisma.guilds.update({
			where: {
				guildId: message.guild!.id
			},
			data: {
				language: language
			}
		});

		return await message.reply({
			content: await resolveKey(message, `commands/replies/admin:language_update`, { language: language, emoji: Emojis.SUCCESS })
		});
	}
}
