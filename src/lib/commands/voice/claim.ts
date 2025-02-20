import { container } from '@sapphire/pieces';
import { resolveKey } from '@sapphire/plugin-i18next';
import { Subcommand } from '@sapphire/plugin-subcommands';
import { Emojis } from '../../../shared/enum/Emojis';
import { InteractionResponse, Message } from 'discord.js';

export class VoiceClaimCommand {
	public static async messageRun(message: Message) {
		if (message.channel.isSendable()) await message.channel.sendTyping();
		const member = message.member;
		if (!member!.voice.channel) {
			return await message.reply({
				content: await resolveKey(message, `commands/replies/commandDenied:voice_channel_not_found`, {
					emoji: Emojis.ERROR
				})
			});
		}

		const voiceChannel = member!.voice.channel;
		const channel = await container.helpers.voice.find(voiceChannel.id, message.guild!.id);

		if (!channel) {
			return message.reply({
				content: await resolveKey(message, `commands/replies/commandDenied:channel_not_found`, {
					emoji: Emojis.ERROR
				})
			});
		}

		if (channel!.channelOwnerId === member!.id) {
			return message.reply({
				content: await resolveKey(message, `commands/replies/commandDenied:already_owner`, {
					emoji: Emojis.ERROR
				})
			});
		}

		if (voiceChannel.members.has(channel!.channelOwnerId)) {
			return message.reply({
				content: await resolveKey(message, `commands/replies/voice:claim_error`, {
					emoji: Emojis.ERROR
				})
			});
		} else {
			await container.prisma.voice_temp_channels.update({
				where: {
					guildId_channelId: {
						channelId: voiceChannel.id,
						guildId: message.guild!.id
					}
				},
				data: {
					channelOwnerId: member!.id
				}
			});

			await voiceChannel.permissionOverwrites.edit(member!.id, {
				ViewChannel: true,
				Connect: true,
				Speak: true
			});

			return message.reply({
				content: await resolveKey(message, `commands/replies/voice:claim_success`, {
					emoji: Emojis.SUCCESS
				})
			});
		}
	}

	public static async chatInputRun(interaction: Subcommand.ChatInputCommandInteraction): Promise<InteractionResponse> {
		const user = interaction.user.id;
		const member = interaction.guild!.members.resolve(user);
		if (!member!.voice.channel) {
			return interaction.reply({
				content: await resolveKey(interaction, `commands/replies/commandDenied:voice_channel_not_found`, {
					emoji: Emojis.ERROR
				}),
				ephemeral: true
			});
		}

		const voiceChannel = member!.voice.channel;
		const channel = await container.helpers.voice.find(voiceChannel.id, interaction.guild!.id);

		if (!channel) {
			return await interaction.reply({
				content: await resolveKey(interaction, `commands/replies/commandDenied:channel_not_found`, {
					emoji: Emojis.ERROR
				}),
				ephemeral: true
			});
		}

		if (channel!.channelOwnerId === member!.id) {
			return interaction.reply({
				content: await resolveKey(interaction, `commands/replies/commandDenied:already_owner`, {
					emoji: Emojis.ERROR
				}),
				ephemeral: true
			});
		}

		if (voiceChannel.members.has(channel!.channelOwnerId)) {
			return interaction.reply({
				content: await resolveKey(interaction, `commands/replies/voice:claim_error`, {
					emoji: Emojis.ERROR
				}),
				ephemeral: true
			});
		} else {
			// Update the database to set the current user as the channel owner
			await container.prisma.voice_temp_channels.update({
				where: {
					guildId_channelId: {
						channelId: voiceChannel.id,
						guildId: interaction.guild!.id
					}
				},
				data: {
					channelOwnerId: member!.id
				}
			});

			// Grant the claiming user specific permissions
			await voiceChannel.permissionOverwrites.edit(member!.id, {
				ViewChannel: true,
				Connect: true,
				Speak: true
			});

			return interaction.reply({
				content: await resolveKey(interaction, `commands/replies/voice:claim_success`, {
					emoji: Emojis.SUCCESS
				}),
				ephemeral: false
			});
		}
	}
}
