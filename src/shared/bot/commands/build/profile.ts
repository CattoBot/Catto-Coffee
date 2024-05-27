import { Subcommand } from '@sapphire/plugin-subcommands';
import { applyLocalizedBuilder } from '@sapphire/plugin-i18next';

export class ProfileSetInformationSubcommands {
    public static registerCommands(registry: Subcommand.Registry): void {
        registry.registerChatInputCommand((builder) =>
            applyLocalizedBuilder(builder, 'commands/names/set:set', 'commands/descriptions/set:set_description')
                .addSubcommand((command) => applyLocalizedBuilder(command, 'commands/names/set:bio', 'commands/descriptions/set:bio_description')
                )
        );
    }
}