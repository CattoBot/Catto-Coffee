import { Subcommand } from '@sapphire/plugin-subcommands';
import { applyLocalizedBuilder } from '@sapphire/plugin-i18next';

export class LevelingCommandsRegistration {
    public static registerCommands(registry: Subcommand.Registry): void {
        registry.registerChatInputCommand((builder) =>
            applyLocalizedBuilder(builder, 'commands/names/level:level', 'commands/descriptions/admin:level')
                .addSubcommand((command) => applyLocalizedBuilder(command, 'commands/names/level:rank', 'commands/descriptions/level:rank'))
                .addSubcommand((command) => applyLocalizedBuilder(command, 'commands/names/level:leaderboard', 'commands/descriptions/level:leaderboard'))
                .addSubcommand((command) => applyLocalizedBuilder(command, 'commands/names/level:rewards', 'commands/descriptions/level:rewards'))
        );
    }
}