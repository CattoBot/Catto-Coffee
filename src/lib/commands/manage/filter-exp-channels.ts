import { container } from '@sapphire/pieces';
import { resolveKey } from '@sapphire/plugin-i18next';
import { Subcommand } from '@sapphire/plugin-subcommands';
import { VoiceChannel, TextChannel, GuildChannel, InteractionResponse } from 'discord.js';
import { Emojis } from '../../../shared/enum/Emojis';

export class FilterVoiceChannelCommand {
	public static async add(interaction: Subcommand.ChatInputCommandInteraction): Promise<InteractionResponse> {
		const channel = interaction.options.getChannel('channel', true) as GuildChannel;
		const module = interaction.options.getString('module', true);

		if (!this.isValidChannel(channel, module)) {
			return await interaction.reply({ content: await resolveKey(interaction, `commands/replies/error:invalid_channel`), ephemeral: true });
		}

		const channelExists = await this.channelExists(interaction.guild!.id, channel.id, module);
		if (channelExists) {
			return await interaction.reply({
				content: await resolveKey(interaction, `commands/replies/error:already_filtered_channel`),
				ephemeral: true
			});
		}

		const result = await this.addChannelToModule(interaction.guild!.id, channel.id, module);
		if (result) {
			const redisKey = `filteredVoiceChannel:${interaction.guild!.id}:${channel.id}`;
			await container.redis.set(redisKey, 'true');

			return await interaction.reply({
				content: await resolveKey(interaction, `commands/replies/admin:${module.toLowerCase()}_filter_channel_add`, {
					channel: channel,
					emoji: Emojis.SUCCESS
				}),
				ephemeral: false
			});
		}

		return await interaction.reply({ content: await resolveKey(interaction, `commands/replies/error:invalid_module`), ephemeral: true });
	}

	public static async remove(interaction: Subcommand.ChatInputCommandInteraction) {
		const channel = interaction.options.getChannel('channel', true) as GuildChannel;
		const module = interaction.options.getString('module', true);

		if (!this.isValidChannel(channel, module)) {
			return interaction.reply({ content: await resolveKey(interaction, `commands/replies/error:invalid_channel`), ephemeral: true });
		}

		const channelExists = await this.channelExists(interaction.guild!.id, channel.id, module);
		if (!channelExists) {
			return await interaction.reply({
				content: await resolveKey(interaction, `commands/replies/error:not_filtered_channel`),
				ephemeral: true
			});
		}

		const result = await this.removeChannelFromModule(interaction.guild!.id, channel.id, module);
		if (result) {
			const redisKey = `filteredVoiceChannel:${interaction.guild!.id}:${channel.id}`;
			const redisKey2 = `filteredTextChannel:${interaction.guild!.id}:${channel.id}`;
			await container.redis.del(redisKey);
			await container.redis.del(redisKey2);

			return await interaction.reply({
				content: await resolveKey(interaction, `commands/replies/admin:${module.toLowerCase()}_filter_channel_remove`, {
					channel: channel,
					emoji: Emojis.SUCCESS
				}),
				ephemeral: false
			});
		}

		return await interaction.reply({
			content: await resolveKey(interaction, `commands/replies/success:voice_bonus_channel_remove`, {
				channel: channel,
				emoji: Emojis.SUCCESS
			}),
			ephemeral: false
		});
	}

	private static isValidChannel(channel: GuildChannel, module: string): boolean {
		if (module === 'Voice' && !(channel instanceof VoiceChannel)) {
			return false;
		}
		if (module === 'Text' && !(channel instanceof TextChannel)) {
			return false;
		}
		return true;
	}

	private static async channelExists(guildId: string, channelId: string, module: string): Promise<boolean> {
		const model = FilterVoiceChannelCommand.getModel(module);
		if (!model) return false;

		const channelDb = await (container.prisma[model] as any).findUnique({
			where: {
				guildId_channelId: {
					guildId,
					channelId
				}
			}
		});

		return !!channelDb;
	}

	private static async removeChannelFromModule(guildId: string, channelId: string, module: string): Promise<boolean> {
		const model = FilterVoiceChannelCommand.getModel(module);
		if (!model) return false;

		await (container.prisma[model] as any).deleteMany({
			where: {
				guildId,
				channelId
			}
		});

		return true;
	}

	private static async addChannelToModule(guildId: string, channelId: string, module: string): Promise<boolean> {
		const model = FilterVoiceChannelCommand.getModel(module);
		if (!model) return false;

		await (container.prisma[model] as any).create({
			data: {
				guildId,
				channelId
			}
		});

		return true;
	}

	private static getModel(module: string) {
		switch (module) {
			case 'Voice':
				return 'filtered_voice_channels';
			case 'Text':
				return 'filtered_text_channels';
			default:
				return null;
		}
	}
}
