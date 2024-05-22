import { Subcommand } from '@sapphire/plugin-subcommands';
import { applyLocalizedBuilder } from '@sapphire/plugin-i18next';

export class MusicCommandsRegistry {
    public static registerCommands(registry: Subcommand.Registry): void {
        registry.registerChatInputCommand((builder) =>
            applyLocalizedBuilder(builder, 'commands/names/music:music', 'commands/descriptions/music:music')
                .addSubcommand((command) => applyLocalizedBuilder(command, 'commands/names/music:play', 'commands/descriptions/music:play')
                .addStringOption((option) => applyLocalizedBuilder(option, 'commands/options/music:song', 'commands/options/music:song_desc').setRequired(true)))
                .addSubcommand((command) => applyLocalizedBuilder(command, 'commands/names/music:queue', 'commands/descriptions/music:queue'))
                .addSubcommand((command) => applyLocalizedBuilder(command, 'commands/names/music:stop', 'commands/descriptions/music:stop'))
        );
    }
}