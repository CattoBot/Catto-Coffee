import { applyLocalizedBuilder } from "@sapphire/plugin-i18next";
import { Subcommand } from "@sapphire/plugin-subcommands";

export class BlacklistCommandRegistry {
    public static registerCommands(registry: Subcommand.Registry): void {
        registry.registerChatInputCommand((builder) =>
            applyLocalizedBuilder(builder, 'commands/names/blacklist:blacklist', 'commands/descriptions/blacklist:blacklist')
                .addSubcommandGroup((group) => applyLocalizedBuilder(group, 'commands/names/blacklist:blacklist_add', 'commands/descriptions/blacklist:blacklist_add')
                    .addSubcommand((command) => applyLocalizedBuilder(command, 'commands/names/blacklist:server', 'commands/descriptions/blacklist:server')
                        .addStringOption((option) => applyLocalizedBuilder(option, 'commands/names/blacklist:server_bl', 'commands/descriptions/blacklist:server_bl').setRequired(true))
                    )
                    .addSubcommand((command) => applyLocalizedBuilder(command, 'commands/names/blacklist:user', 'commands/descriptions/blacklist:user')
                        .addStringOption((option) => applyLocalizedBuilder(option, 'commands/names/blacklist:user_bl', 'commands/descriptions/blacklist:user_bl').setRequired(true))
                    )
                )
                .addSubcommandGroup((group) => applyLocalizedBuilder(group, 'commands/names/blacklist:blacklist_remove', 'commands/descriptions/blacklist:blacklist_remove')
                    .addSubcommand((command) => applyLocalizedBuilder(command, 'commands/names/blacklist:server_remove', 'commands/descriptions/blacklist:server_remove')
                        .addStringOption((option) => applyLocalizedBuilder(option, 'commands/names/blacklist:server_remove', 'commands/descriptions/blacklist:server_remove').setRequired(true))
                    )
                    .addSubcommand((command) => applyLocalizedBuilder(command, 'commands/names/blacklist:user_remove', 'commands/descriptions/blacklist:user_remove')
                        .addStringOption((option) => applyLocalizedBuilder(option, 'commands/names/blacklist:user_remove', 'commands/descriptions/blacklist:user_remove').setRequired(true))
                    )
                ), {
                    idHints: [''], guildIds: ["1134593541172117544" , "998352785202479134"]
                }
        )
    }
}