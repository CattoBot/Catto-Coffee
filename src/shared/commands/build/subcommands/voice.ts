import { Subcommand } from '@sapphire/plugin-subcommands';
import { applyLocalizedBuilder } from '@sapphire/plugin-i18next';

export class VoiceCommandsRegistration {
    public static registerCommands(registry: Subcommand.Registry): void {
        registry.registerChatInputCommand((builder) =>
            applyLocalizedBuilder(builder, 'commands/names:voice', 'commands/descriptions:voice')
                .addSubcommand((command) => applyLocalizedBuilder(command, 'commands/names/voice:voice_setup', 'commands/descriptions/voice:voice_setup'))
                .addSubcommand((command) => applyLocalizedBuilder(command, 'commands/names/voice:name', 'commands/descriptions/voice:name'))
                .addSubcommand((command) => applyLocalizedBuilder(command, 'commands/names/voice:claim', 'commands/descriptions/voice:claim'))
                .addSubcommand((command) => applyLocalizedBuilder(command, 'commands/names/voice:ghost', 'commands/descriptions/voice:ghost'))
                .addSubcommand((command) => applyLocalizedBuilder(command, 'commands/names/voice:unghost', 'commands/descriptions/voice:unghost'))
                .addSubcommand((command) => applyLocalizedBuilder(command, 'commands/names/voice:reset', 'commands/descriptions/voice:reset'))
                .addSubcommand((command) => applyLocalizedBuilder(command, 'commands/names/voice:lock', 'commands/descriptions/voice:lock'))
                .addSubcommand((command) => applyLocalizedBuilder(command, 'commands/names/voice:unlock', 'commands/descriptions/voice:unlock'))
                .addSubcommand((command) => applyLocalizedBuilder(command, 'commands/names/voice:limit', 'commands/descriptions/voice:limit')
                    .addIntegerOption((option) => applyLocalizedBuilder(option, 'commands/options/voice:limit_name', 'commands/options/voice:limit_description').setRequired(true))
                )
                .addSubcommand((command) => applyLocalizedBuilder(command, 'commands/names/voice:permit', 'commands/descriptions/voice:permit')
                    .addUserOption((option) => applyLocalizedBuilder(option, 'commands/options/voice:permit_name', 'commands/options/voice:permit_description').setRequired(true))
                )
                .addSubcommand((command) => applyLocalizedBuilder(command, 'commands/names/voice:reject', 'commands/descriptions/voice:reject')
                    .addUserOption((option) => applyLocalizedBuilder(option, 'commands/options/voice:reject_name', 'commands/options/voice:reject_description').setRequired(true))
                )
                .addSubcommand((command) => applyLocalizedBuilder(command, 'commands/names/voice:transfer', 'commands/descriptions/voice:transfer')
                    .addUserOption((option) => applyLocalizedBuilder(option, 'commands/options/voice:transfer_name', 'commands/options/voice:transfer_description').setRequired(true))
                )
                .addSubcommand((command) => applyLocalizedBuilder(command, 'commands/names/voice:invite', 'commands/descriptions/voice:invite')
                    .addUserOption((option) => applyLocalizedBuilder(option, 'commands/options/voice:invite_name', 'commands/options/voice:invite_description').setRequired(true))
                )
                .addSubcommand((command) => applyLocalizedBuilder(command, 'commands/names/voice:bitrate', 'commands/descriptions/voice:bitrate')
                    .addIntegerOption((option) => applyLocalizedBuilder(option, 'commands/options/voice:bitrate', 'commands/options/voice:bitrate_description').setRequired(true))
                )
                .addSubcommand((command) => applyLocalizedBuilder(command, 'commands/names/voice:trust', 'commands/descriptions/voice:trust')
                    .addUserOption((option) => applyLocalizedBuilder(option, 'commands/options/voice:trust_name', 'commands/options/voice:trust_description').setRequired(true))
                )
        );
    }
}
