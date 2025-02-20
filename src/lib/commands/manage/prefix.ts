import { container } from '@sapphire/pieces';
import { resolveKey } from '@sapphire/plugin-i18next';
import { Subcommand } from '@sapphire/plugin-subcommands';
import { Emojis } from '../../../shared/enum/Emojis';
import { Message } from 'discord.js';
import { Args } from '@sapphire/framework';

export class PrefixCommand {
	public static async chatInputRun(interaction: Subcommand.ChatInputCommandInteraction) {
		const prefix = interaction.options.getString('prefix', true);
		if (!prefix) return interaction.reply({ content: await resolveKey(interaction, `commands/replies/error:invalid_prefix`), ephemeral: true });

		await container.prisma.guilds.update({
			where: {
				guildId: interaction.guild!.id
			},
			data: {
				prefix: prefix
			}
		});
		await container.redis.del(`guild:${interaction.guild!.id}:prefix`);
		return await interaction.reply({
			content: await resolveKey(interaction, `commands/replies/admin:prefix_update`, { prefix: prefix, emoji: Emojis.SUCCESS }),
			ephemeral: false
		});
	}

	public static async messageRun(message: Message, args: Args) {
		const prefix = await args.rest('string');
		if (!prefix) return message.reply({ content: await resolveKey(message, `commands/replies/error:invalid_prefix`, { emoji: Emojis.ERROR }) });
		if (prefix.length > 5)
			return message.reply({ content: await resolveKey(message, `commands/replies/error:prefix_length`, { emoji: Emojis.ERROR }) });
		await container.prisma.guilds.update({
			where: {
				guildId: message.guild!.id
			},
			data: {
				prefix: prefix
			}
		});
		await container.redis.del(`guild:${message.guild!.id}:prefix`);
		return await message.reply({
			content: await resolveKey(message, `commands/replies/admin:prefix_update`, { prefix: prefix, emoji: Emojis.SUCCESS })
		});
	}
}
