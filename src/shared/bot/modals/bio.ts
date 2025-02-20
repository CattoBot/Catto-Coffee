import { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';

export const BioModalHandler = new ModalBuilder()
	.setCustomId('modal-bio')
	.setTitle('Profile Bio')
	.addComponents(
		new ActionRowBuilder<TextInputBuilder>().addComponents(
			new TextInputBuilder()
				.setCustomId('text-bio')
				.setLabel('Bio')
				.setPlaceholder('Tell us about yourself!')
				.setRequired(true)
				.setStyle(TextInputStyle.Paragraph)
				.setMinLength(1)
				.setMaxLength(155)
		)
	);
