import { resolveKey } from '@sapphire/plugin-i18next';
import { Subcommand } from '@sapphire/plugin-subcommands';
import { Emojis } from '../../../shared/enum/Emojis';
import { InteractionResponse, Message } from 'discord.js';
import { container } from '@sapphire/pieces';

export class VoiceGhostCommand {
	private static async fetchPermittedRoles(guildId: string) {
		return container.prisma.permittedVoiceRoles.findMany({
			where: { guildId },
			select: { roleId: true }
		});
	}

	public static async messageRun(message: Message) {
		if (message.channel.isSendable()) await message.channel.sendTyping();

		const member = message.member;
		const channel = member!.voice.channel;

		if (!channel) {
			return message.reply({
				content: await resolveKey(message, 'commands/replies/error:no_voice_channel')
			});
		}

		const guildId = channel.guild.id;

		try {
			const permittedRoles = await this.fetchPermittedRoles(guildId);
			await channel.permissionOverwrites.edit(channel.guild.roles.everyone, {
				ViewChannel: false
			});

			if (permittedRoles.length > 0) {
				for (const { roleId } of permittedRoles) {
					const role = channel.guild.roles.cache.get(roleId);
					if (role) {
						await channel.permissionOverwrites.edit(role, {
							ViewChannel: false
						});
					}
				}
			}

			return message.reply({
				content: await resolveKey(message, 'commands/replies/voice:ghost_success', { emoji: Emojis.SUCCESS })
			});
		} catch (error) {
			container.logger.error(error);
			return message.reply({
				content: await resolveKey(message, 'commands/replies/error:error')
			});
		}
	}

	public static async chatInputRun(interaction: Subcommand.ChatInputCommandInteraction): Promise<InteractionResponse> {
		const user = interaction.user.id;
		const member = interaction.guild!.members.resolve(user);
		const channel = member!.voice.channel;

		if (!channel) {
			return interaction.reply({
				content: await resolveKey(interaction, 'commands/replies/error:no_voice_channel'),
				ephemeral: true
			});
		}

		const guildId = channel.guild.id;

		try {
			const permittedRoles = await this.fetchPermittedRoles(guildId);

			// Disable `ViewChannel` for @everyone
			await channel.permissionOverwrites.edit(interaction.guild!.roles.everyone, {
				ViewChannel: false
			});

			if (permittedRoles.length > 0) {
				// Disable `ViewChannel` for all permitted roles
				for (const { roleId } of permittedRoles) {
					const role = interaction.guild!.roles.cache.get(roleId);
					if (role) {
						await channel.permissionOverwrites.edit(role, {
							ViewChannel: false
						});
					}
				}
			}

			return interaction.reply({
				content: await resolveKey(interaction, 'commands/replies/voice:ghost_success', { emoji: Emojis.SUCCESS }),
				ephemeral: true
			});
		} catch (error) {
			container.logger.error(error);
			return interaction.reply({
				content: await resolveKey(interaction, 'commands/replies/error:error'),
				ephemeral: true
			});
		}
	}
}
