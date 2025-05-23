import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';

export const VoiceNameModal = new ModalBuilder()
	.setCustomId('vc-name')
	.setTitle('Voice Channel Name')
	.addComponents(
		new ActionRowBuilder<TextInputBuilder>().addComponents(
			new TextInputBuilder()
				.setCustomId('voice-name')
				.setLabel('Voice Channel Name')
				.setRequired(true)
				.setStyle(TextInputStyle.Paragraph)
				.setMinLength(1)
				.setMaxLength(60)
		)
	);

export const VoiceSetupModalHandler = new ModalBuilder()
	.setCustomId('vc-setups')
	.setTitle('Voice Channel Setup')
	.addComponents(
		new ActionRowBuilder<TextInputBuilder>().addComponents(
			new TextInputBuilder()
				.setCustomId('category-name')
				.setPlaceholder('Example: Join to Create')
				.setLabel('Category Name')
				.setRequired(true)
				.setStyle(TextInputStyle.Short)
				.setMinLength(1)
				.setMaxLength(20)
		)
	)
	.addComponents(
		new ActionRowBuilder<TextInputBuilder>().addComponents(
			new TextInputBuilder()
				.setCustomId('channel-name')
				.setPlaceholder("Example: {user}'s Channel")
				.setLabel('Voice channels name')
				.setRequired(true)
				.setStyle(TextInputStyle.Short)
				.setMinLength(1)
				.setMaxLength(40)
		)
	)
	.addComponents(
		new ActionRowBuilder<TextInputBuilder>().addComponents(
			new TextInputBuilder()
				.setCustomId('max-users')
				.setPlaceholder('Maximum users allowed in VCs by default')
				.setLabel('Max Users')
				.setRequired(false)
				.setStyle(TextInputStyle.Short)
				.setMinLength(1)
				.setMaxLength(99)
		)
	)
	.addComponents(
		new ActionRowBuilder<TextInputBuilder>().addComponents(
			new TextInputBuilder()
				.setCustomId('should-edit')
				.setPlaceholder('Should the channels be editable? type yes or no')
				.setLabel('Should Edit? (yes/no)')
				.setRequired(true)
				.setStyle(TextInputStyle.Short)
				.setMinLength(2)
				.setMaxLength(3)
		)
	);
