import { container } from '@sapphire/pieces';
import { fetchT, resolveKey } from '@sapphire/plugin-i18next';
import { Subcommand } from '@sapphire/plugin-subcommands';
import { Emojis } from '../../../shared/enum/Emojis';
import { GuildMember, InteractionResponse, Message, User } from 'discord.js';
import { Args } from '@sapphire/framework';

export class VoiceTransferCommand {
	public static async messageRun(message: Message, args: Args) {
		if (message.channel.isSendable()) await message.channel.sendTyping();
		const translateKey = await fetchT(message);

		// Fetch the user mentioned in the command
		const user = (await args.pick('user').catch(() => null)) as User | null;
		if (!user) {
			return message.reply(translateKey('commands/replies/commandDenied:voice_user_not_found'));
		}

		const member = message.guild!.members.resolve(user.id);
		if (!member) {
			return message.reply(translateKey('commands/replies/commandDenied:voice_member_not_found'));
		}

		if (!message.member!.voice.channel) {
			return message.reply(translateKey('commands/replies/commandDenied:not_in_voice_channel'));
		}

		const voiceChannel = message.member!.voice.channel;

		try {
			// Update the channel owner in the database
			await container.prisma.voice_temp_channels.update({
				where: {
					guildId_channelId: {
						channelId: voiceChannel.id,
						guildId: message.guild!.id
					}
				},
				data: {
					channelOwnerId: member.id
				}
			});

			// Update channel permissions to grant the new user specific permissions
			await voiceChannel.permissionOverwrites.edit(member.id, {
				ViewChannel: true,
				Connect: true,
				Speak: true
			});

			return message.reply(
				await resolveKey(message, 'commands/replies/voice:transfer_success', {
					user: user.displayName,
					emoji: Emojis.SUCCESS
				})
			);
		} catch (error) {
			container.console.error(error);
			return message.reply(
				await resolveKey(message, 'commands/replies/error:error', {
					user: user.displayName,
					emoji: Emojis.ERROR
				})
			);
		}
	}

	public static async chatInputRun(interaction: Subcommand.ChatInputCommandInteraction): Promise<InteractionResponse> {
		const translateKey = await fetchT(interaction);
		const user = interaction.options.getUser(translateKey('commands/options/voice:reject_name'));
		if (!user) {
			return interaction.reply({
				content: translateKey('commands/replies/commandDenied:voice_user_not_found'),
				ephemeral: true
			});
		}

		const guild = interaction.guild;
		if (guild) {
			const member = interaction.guild.members.resolve(user!.id) as GuildMember;
			const Membervoicechannel = member.voice.channel;

			if (!Membervoicechannel) {
				return interaction.reply({
					content: translateKey('commands/replies/commandDenied:not_in_voice_channel'),
					ephemeral: true
				});
			}

			try {
				await container.prisma.voice_temp_channels.update({
					where: {
						guildId_channelId: {
							channelId: Membervoicechannel.id,
							guildId: interaction.guild!.id
						}
					},
					data: {
						channelOwnerId: member.id
					}
				});

				await Membervoicechannel.permissionOverwrites.edit(member.id, {
					ViewChannel: true,
					Connect: true,
					Speak: true
				});
			} catch (error) {
				container.console.error(error);
				return interaction.reply({
					content: await resolveKey(interaction, 'commands/replies/error:error', {
						user: user.displayName,
						emoji: Emojis.ERROR
					}),
					ephemeral: true
				});
			}
		}

		return interaction.reply({
			content: await resolveKey(interaction, 'commands/replies/voice:transfer_success', {
				user: user.displayName,
				emoji: Emojis.SUCCESS
			})
		});
	}
}
