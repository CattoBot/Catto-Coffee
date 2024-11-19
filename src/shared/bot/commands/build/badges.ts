import { Subcommand } from '@sapphire/plugin-subcommands';
import { applyLocalizedBuilder } from '@sapphire/plugin-i18next';
import { Config } from '../../../../config';

export class BadgesCommandRegistry {
    public static registerCommands(registry: Subcommand.Registry): void {
        registry.registerChatInputCommand((builder) =>
            applyLocalizedBuilder(builder, 'commands/names/badges:badges', 'commands/descriptions/badges:badges')
                .addSubcommand((command) => applyLocalizedBuilder(command, 'commands/names/badges:create', 'commands/descriptions/badges:create')
                    .addAttachmentOption((option) => applyLocalizedBuilder(option, 'commands/options/badges:badge', 'commands/options/badges:badges_desc').setRequired(true))
                    .addStringOption((option) => applyLocalizedBuilder(option, 'commands/options/badges:name', 'commands/options/badges:name_desc').setRequired(true))
                )
                .addSubcommand((command) => applyLocalizedBuilder(command, 'commands/names/badges:list', 'commands/descriptions/badges:list'))
                .addSubcommand((command) => applyLocalizedBuilder(command, 'commands/names/badges:assign', 'commands/descriptions/badges:assign')
                    .addNumberOption((option) => applyLocalizedBuilder(option, 'commands/options/badges:badge', 'commands/options/badges:badges_desc').setRequired(true))
                    .addStringOption((option) => applyLocalizedBuilder(option, 'commands/options/badges:user', 'commands/options/badges:user_desc').setRequired(true)))
                .addSubcommand((command) => applyLocalizedBuilder(command, 'commands/names/badges:remove', 'commands/descriptions/badges:remove')
                    .addStringOption((option) => applyLocalizedBuilder(option, 'commands/options/badges:badge', 'commands/options/badges:badges_desc').setRequired(true))
                    .addStringOption((option) => applyLocalizedBuilder(option, 'commands/options/badges:user', 'commands/options/badges:user_desc').setRequired(true))
                ), {
            idHints: [''],
            guildIds: Config.guilds
        }
        )
    }
}