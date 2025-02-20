import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import { ChannelType, PermissionFlagsBits, type Guild, type GuildChannel, type InteractionResponse, type ModalSubmitInteraction } from 'discord.js';
import { Emojis } from '../../shared/enum/Emojis';
import { resolveKey } from '@sapphire/plugin-i18next';

export class VoiceSetupModalHandler extends InteractionHandler {
	public constructor(ctx: InteractionHandler.LoaderContext, options: InteractionHandler.Options) {
		super(ctx, {
			...options,
			interactionHandlerType: InteractionHandlerTypes.ModalSubmit
		});
	}

	public override parse(interaction: ModalSubmitInteraction) {
		if (interaction.customId !== 'vc-setups') return this.none();
		return this.some();
	}

	public async run(interaction: ModalSubmitInteraction): Promise<InteractionResponse> {
		const categoryName = interaction.fields.getTextInputValue('category-name');
		const channelName = interaction.fields.getTextInputValue('channel-name');
		const voiceLimit = interaction.fields.getTextInputValue('max-users');
		const isEditable = interaction.fields.getTextInputValue('should-edit');
		// const shouldEnumerate = interaction.fields.getTextInputValue('should-enumerate');

		const limit = parseInt(voiceLimit, 10);

		if (isNaN(limit) || limit < 0 || limit > 99) {
			const errorKey = isNaN(limit) ? 'commands/replies/voice:voice_setup_error_limit' : 'commands/replies/voice:voice_setup_error_limit_range';
			return interaction.reply({
				content: await resolveKey(interaction, errorKey, { emoji: Emojis.ERROR }),
				ephemeral: true
			});
		}

		let editable = false;
		if (isEditable.toLowerCase() === 'yes') {
			editable = true;
		} else if (isEditable.toLocaleLowerCase() !== 'no') {
			return interaction.reply({
				content: await resolveKey(interaction, 'commands/replies/voice:voice_setup_error_editable', { emoji: Emojis.ERROR }),
				ephemeral: true
			});
		}

		// let enumerate = false;
		// if (shouldEnumerate === 'yes') {
		//     enumerate = true;
		// } else if (shouldEnumerate !== 'no') {
		//     return interaction.reply({
		//         content: await resolveKey(interaction, 'commands/replies/voice:voice_setup_error_enumerate', { emoji: Emojis.ERROR }),
		//         ephemeral: true,
		//     });
		// }

		const category = await this.createCategory(interaction.guild!, categoryName);
		if (!category) return interaction.reply({ content: 'Error creating category.', ephemeral: true });

		const channel = await this.createVoiceChannel(interaction.guild!, category.id);
		if (!channel) return interaction.reply({ content: 'Error creating voice channel.', ephemeral: true });
		await this.createDatabaseEntry(interaction.guild!, channel, category, limit, channelName, true, editable);
		await this.createDatabaseEntryForEditableChannel(interaction.guild!.id, category.id, editable);
		return interaction.reply({
			content: await resolveKey(interaction, 'commands/replies/voice:voice_setup_success', { emoji: Emojis.SUCCESS }),
			ephemeral: false
		});
	}

	private async createDatabaseEntryForEditableChannel(guildId: string, categoryId: string, editable: boolean) {
		const entry = await this.container.prisma.editable_channels.create({
			data: {
				guildId: guildId,
				categoryId: categoryId,
				editable: editable
			}
		});
		return entry;
	}

	private async createDatabaseEntry(
		guild: Guild,
		channel: GuildChannel,
		category: GuildChannel,
		channelLimit: number,
		channelName: string,
		shouldEnumerate: boolean,
		shouldEdit: boolean
	): Promise<void> {
		try {
			await this.container.prisma.i_voice_temp_channels.create({
				data: {
					channelId: channel.id,
					channelLimit,
					channelName,
					shouldEnumerate,
					editables: shouldEdit,
					guildId: guild.id,
					categoryId: category.id
				}
			});
		} catch (error) {
			console.error(error);
		}
	}

	private async createCategory(guild: Guild, name: string): Promise<GuildChannel | undefined> {
		try {
			return await guild.channels.create({
				name,
				type: ChannelType.GuildCategory
			});
		} catch (error) {
			console.error(error);
			return undefined;
		}
	}

	private async createVoiceChannel(guild: Guild, categoryId: string): Promise<GuildChannel | undefined> {
		try {
			return await guild.channels.create({
				name: 'Join 🎤',
				parent: categoryId,
				type: ChannelType.GuildVoice,
				permissionOverwrites: [
					{
						id: guild.roles.everyone.id,
						allow: PermissionFlagsBits.Connect
					}
				]
			});
		} catch (error) {
			console.error(error);
			return undefined;
		}
	}
}
