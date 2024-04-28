import { Subcommand } from '@sapphire/plugin-subcommands';
import { applyLocalizedBuilder } from '@sapphire/plugin-i18next';

export class AdminSubCommandsRegistration {
    public static registerCommands(registry: Subcommand.Registry): void {
        registry.registerChatInputCommand((builder) =>
            applyLocalizedBuilder(builder, 'commands/names/admin:admin', 'commands/descriptions/admin:admin')
                .addSubcommandGroup((group) => applyLocalizedBuilder(group, 'commands/names/admin:setup', 'commands/descriptions/admin:setup')
                    .addSubcommand((command) => applyLocalizedBuilder(command, 'commands/names/admin:setup_logs', 'commands/descriptions/admin:setup_logs')
                        .addChannelOption((option) => applyLocalizedBuilder(option, 'commands/options/admin:channel_logs', 'commands/options/admin:channel_description').setRequired(true))
                    )
                    .addSubcommand((command) => applyLocalizedBuilder(command, 'commands/names/admin:setup_voices', 'commands/descriptions/admin:setup_voices'))
                )
                .addSubcommandGroup((group) => applyLocalizedBuilder(group, 'commands/names/admin:blacklist', 'commands/descriptions/admin:blacklist')
                    .addSubcommand((command) => applyLocalizedBuilder(command, 'commands/names/admin:bl_add', 'commands/descriptions/admin:bl_add')
                        .addUserOption((option) => applyLocalizedBuilder(option, 'commands/options/admin:bl_user', 'commands/options/admin:bl_user_description').setRequired(true))
                    )
                    .addSubcommand((command) => applyLocalizedBuilder(command, 'commands/names/admin:bl_remove', 'commands/descriptions/admin:bl_remove')
                        .addUserOption((option) => applyLocalizedBuilder(option, 'commands/options/admin:bl_user', 'commands/options/admin:bl_user_description_remove').setRequired(true))
                    )
                )
        );
    }
}