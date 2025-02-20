import { container } from '@sapphire/pieces';
import { resolveKey } from '@sapphire/plugin-i18next';
import { Subcommand } from '@sapphire/plugin-subcommands';
import { Emojis } from '../../../shared/enum/Emojis';
import { GuildMember, InteractionResponse, Message } from 'discord.js';

export class VoiceLockCommand {
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

			if (permittedRoles.length > 0) {
				// Disable `Connect` for @everyone
				await channel.permissionOverwrites.edit(channel.guild.roles.everyone, {
					Connect: false
				});

				// Disable `Connect` for all permitted roles
				for (const { roleId } of permittedRoles) {
					const role = channel.guild.roles.cache.get(roleId);
					if (role) {
						await channel.permissionOverwrites.edit(role, {
							Connect: false
						});
					}
				}
			} else {
				// If no permitted roles, disable `Connect` only for @everyone
				await channel.permissionOverwrites.edit(channel.guild.roles.everyone, {
					Connect: false
				});
			}

			await this.updateLock(member!);
			return message.reply({
				content: await resolveKey(message, 'commands/replies/voice:lock_success', { emoji: Emojis.SUCCESS })
			});
		} catch (error) {
			container.console.error(error);
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

			if (permittedRoles.length > 0) {
				await channel.permissionOverwrites.edit(interaction.guild!.roles.everyone, {
					Connect: false,
					ViewChannel: false
				});

				for (const { roleId } of permittedRoles) {
					const role = interaction.guild!.roles.cache.get(roleId);
					if (role) {
						await channel.permissionOverwrites.edit(role, {
							Connect: false,
							ViewChannel: true
						});
					}
				}
			} else {
				await channel.permissionOverwrites.edit(interaction.guild!.roles.everyone, {
					Connect: false
				});
			}

			await this.updateLock(member!);
			return interaction.reply({
				content: await resolveKey(interaction, 'commands/replies/voice:lock_success', { emoji: Emojis.SUCCESS }),
				ephemeral: true
			});
		} catch (error) {
			container.console.error(error);
			return interaction.reply({
				content: await resolveKey(interaction, 'commands/replies/error:error'),
				ephemeral: true
			});
		}
	}

	private static async updateLock(member: GuildMember) {
		await container.prisma.i_users_temp_voice.upsert({
			where: {
				userId: member.id
			},
			update: {
				isLocked: true
			},
			create: {
				userId: member.id,
				isLocked: true
			}
		});
	}
}
