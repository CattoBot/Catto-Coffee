import { container } from '@sapphire/pieces';
import { Subcommand } from '@sapphire/plugin-subcommands';
import { Role, VoiceChannel } from 'discord.js';
import { Emojis } from '../../../shared/enum/Emojis';

export class PermittedVoiceRoleCommand {
	public static async delete(interaction: Subcommand.ChatInputCommandInteraction) {
		const role = interaction.options.getRole('role', true) as Role;
		const channel = interaction.options.getChannel('channel', true) as VoiceChannel;

		const chanelExists = await container.prisma.i_voice_temp_channels.findUnique({
			where: {
				guildId_channelId: {
					guildId: channel.guild.id,
					channelId: channel.id
				}
			}
		});

		if (!chanelExists) {
			await interaction.reply({
				content: `The channel you provided is not a voice creating channel, make sure to select the correct channel.${Emojis.ERROR}`
			});
			return;
		}

		const rolexeists = await container.prisma.permittedVoiceRoles.findUnique({
			where: {
				guildId_roleId_channelId: {
					guildId: channel.guild.id,
					channelId: channel.id,
					roleId: role.id
				}
			}
		});

		if (!rolexeists) {
			await interaction.reply({ content: `The role you provided is not restricted to this voice channel creator. ${Emojis.ERROR}` });
			return;
		}

		await container.prisma.permittedVoiceRoles.delete({
			where: {
				guildId_roleId_channelId: {
					guildId: channel.guild.id,
					roleId: role.id,
					channelId: channel.id
				}
			}
		});

		await interaction.reply({
			content: `Successfully removed the restriction from <@&${role.id}> to the Voice Channels ${Emojis.SUCCESS}`
		});
	}

	static async run(interaction: Subcommand.ChatInputCommandInteraction) {
		const role = interaction.options.getRole('role', true) as Role;
		const channel = interaction.options.getChannel('channel', true) as VoiceChannel;

		const chanelExists = await container.prisma.i_voice_temp_channels.findUnique({
			where: {
				guildId_channelId: {
					guildId: channel.guild.id,
					channelId: channel.id
				}
			}
		});

		if (!chanelExists) {
			await interaction.reply({
				content: `The channel you provided is not a voice creating channel, make sure to select the correct channel.${Emojis.ERROR}`
			});
			return;
		}

		const rolexeists = await container.prisma.permittedVoiceRoles.findUnique({
			where: {
				guildId_roleId_channelId: {
					guildId: channel.guild.id,
					channelId: channel.id,
					roleId: role.id
				}
			}
		});

		if (rolexeists) {
			await interaction.reply({ content: `The role you provided is already restricted to this voice channel creator. ${Emojis.ERROR}` });
			return;
		}

		await container.prisma.permittedVoiceRoles.create({
			data: {
				guildId: channel.guild.id,
				channelId: channel.id,
				roleId: role.id
			}
		});

		await interaction.reply({
			content: `Successfully restricted the VoiceChannel to <@&${role.id}> ${Emojis.SUCCESS}`
		});
	}
}
