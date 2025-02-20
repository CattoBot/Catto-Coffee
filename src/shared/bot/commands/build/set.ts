import { Subcommand } from '@sapphire/plugin-subcommands';
import { applyLocalizedBuilder } from '@sapphire/plugin-i18next';

export class SetSubcommands {
	public static registerCommands(registry: Subcommand.Registry): void {
		registry.registerChatInputCommand((builder) =>
			applyLocalizedBuilder(builder, 'commands/names/set:set', 'commands/descriptions/set:set_description')
				.addSubcommandGroup((command) =>
					applyLocalizedBuilder(command, 'commands/names/set:profile', 'commands/descriptions/set:profile_description').addSubcommand(
						(command) => applyLocalizedBuilder(command, 'commands/names/set:profile_bio', 'commands/descriptions/set:profile_bio')
					)
				)
				.addSubcommandGroup((command) =>
					applyLocalizedBuilder(command, 'commands/names/set:level', 'commands/descriptions/set:level')
						.addSubcommand((command) =>
							applyLocalizedBuilder(command, 'commands/names/set:level_text', 'commands/descriptions/set:level_text')
								.addUserOption((option) =>
									option.setName('user').setDescription('The user to set the level text for.').setRequired(true)
								)
								.addNumberOption((option) =>
									option.setName('level').setDescription('The level to set the text for.').setRequired(true)
								)
						)
						.addSubcommand((command) =>
							applyLocalizedBuilder(command, 'commands/names/set:level_voice', 'commands/descriptions/set:level_voice')
								.addUserOption((option) =>
									option.setName('user').setDescription('The user to set the level voice for.').setRequired(true)
								)
								.addNumberOption((option) =>
									option.setName('level').setDescription('The level to set the voice for.').setRequired(true)
								)
						)
				)
		);
	}
}
