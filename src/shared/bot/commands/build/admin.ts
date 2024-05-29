import { Subcommand } from '@sapphire/plugin-subcommands';
import { applyLocalizedBuilder } from '@sapphire/plugin-i18next';
import { ChannelType } from 'discord.js';

export class AdminSubCommandsRegistration {
    public static registerCommands(registry: Subcommand.Registry): void {
        registry.registerChatInputCommand((builder) =>
            applyLocalizedBuilder(builder, 'commands/names/admin:admin', 'commands/descriptions/admin:admin')
                .addSubcommandGroup((group) => applyLocalizedBuilder(group, 'commands/names/admin:voice_roles', 'commands/descriptions/admin:voice_roles')
                    .addSubcommand((command) => applyLocalizedBuilder(command, 'commands/names/admin:voice_roles_add', 'commands/descriptions/admin:voice_roles_add')
                        .addRoleOption((option) => applyLocalizedBuilder(option, 'commands/options/admin:role_add_voice', 'commands/options/admin:role_description_add').setRequired(true))
                        .addIntegerOption((option) => applyLocalizedBuilder(option, 'commands/options/admin:level', 'commands/options/admin:level_description').setRequired(true))
                    )
                    .addSubcommand((command) => applyLocalizedBuilder(command, 'commands/names/admin:voice_roles_remove', 'commands/descriptions/admin:voice_roles_remove')
                        .addRoleOption((option) => applyLocalizedBuilder(option, 'commands/options/admin:role_remove_voice', 'commands/options/admin:role_description_remove').setRequired(true))
                        // .addIntegerOption((option) => applyLocalizedBuilder(option, 'commands/options/admin:level', 'commands/options/admin:level_description').setRequired(true))
                    )
                )
                .addSubcommandGroup((group) => applyLocalizedBuilder(group, 'commands/names/admin:text_roles', 'commands/descriptions/admin:text_roles')
                    .addSubcommand((command) => applyLocalizedBuilder(command, 'commands/names/admin:text_roles_add', 'commands/descriptions/admin:text_roles_add')
                        .addRoleOption((option) => applyLocalizedBuilder(option, 'commands/options/admin:role_add_text', 'commands/options/admin:role_description_add_text').setRequired(true))
                        .addIntegerOption((option) => applyLocalizedBuilder(option, 'commands/options/admin:level', 'commands/options/admin:level_description').setRequired(true))
                    )
                    .addSubcommand((command) => applyLocalizedBuilder(command, 'commands/names/admin:text_roles_remove', 'commands/descriptions/admin:text_roles_remove')
                        .addRoleOption((option) => applyLocalizedBuilder(option, 'commands/options/admin:role_remove_text', 'commands/options/admin:role_description_remove_text').setRequired(true))
                    )
                )

                .addSubcommandGroup((group) => applyLocalizedBuilder(group, 'commands/names/admin:experience', 'commands/descriptions/admin:experience')
                    .addSubcommand((command) => applyLocalizedBuilder(command, 'commands/names/admin:reset_user', 'commands/descriptions/admin:reset_user')
                        .addUserOption((option) => applyLocalizedBuilder(option, 'commands/options/admin:reset_user', 'commands/options/admin:reset_user_description').setRequired(true))
                        .addStringOption((option) => applyLocalizedBuilder(option, 'commands/options/admin:module', 'commands/options/admin:module_description').setRequired(true)
                            .setChoices(
                                { name: 'Voice', value: 'Voice' },
                                { name: 'Text', value: 'Text' }
                            )
                        )
                    )
                    .addSubcommand((command) => applyLocalizedBuilder(command, 'commands/names/admin:reset_server', 'commands/descriptions/admin:reset_server')
                        .addStringOption((option) => applyLocalizedBuilder(option, 'commands/options/admin:module', 'commands/options/admin:module_description').setRequired(true)
                            .setChoices(
                                { name: 'Voice', value: 'Voice' },
                                { name: 'Text', value: 'Text' }
                            )
                        )
                    )
                    .addSubcommand((command) => applyLocalizedBuilder(command, 'commands/names/admin:experience_text', 'commands/descriptions/admin:experience_text')
                        .addIntegerOption((option) => applyLocalizedBuilder(option, 'commands/options/admin:min_exp_text', 'commands/options/admin:min_exp_description').setRequired(false))
                        .addIntegerOption((option) => applyLocalizedBuilder(option, 'commands/options/admin:max_exp_text', 'commands/options/admin:max_exp_description').setRequired(false))
                        .addIntegerOption((option) => applyLocalizedBuilder(option, 'commands/options/admin:cooldown_text', 'commands/options/admin:cooldown_description').setRequired(false))
                        .addChannelOption((option) => applyLocalizedBuilder(option, 'commands/options/admin:channel_notification_text', 'commands/options/admin:channel_notification_description').setRequired(false).addChannelTypes(ChannelType.GuildText))
                        .addStringOption((option) => applyLocalizedBuilder(option, 'commands/options/admin:levelup_message_text', 'commands/options/admin:levelup_message_description').setRequired(false))
                    )
                    .addSubcommand((command) => applyLocalizedBuilder(command, 'commands/names/admin:experience_voice', 'commands/descriptions/admin:experience_voice')
                        .addIntegerOption((option) => applyLocalizedBuilder(option, 'commands/options/admin:min_exp_voice', 'commands/options/admin:min_exp_description').setRequired(false))
                        .addIntegerOption((option) => applyLocalizedBuilder(option, 'commands/options/admin:max_exp_voice', 'commands/options/admin:max_exp_description').setRequired(false))
                        .addIntegerOption((option) => applyLocalizedBuilder(option, 'commands/options/admin:cooldown_voice', 'commands/options/admin:cooldown_description').setRequired(false))
                        .addChannelOption((option) => applyLocalizedBuilder(option, 'commands/options/admin:channel_notification_voice', 'commands/options/admin:channel_notification_description').setRequired(false).addChannelTypes(ChannelType.GuildText))
                        .addStringOption((option) => applyLocalizedBuilder(option, 'commands/options/admin:levelup_message_voice', 'commands/options/admin:levelup_message_description').setRequired(false))
                    )
                    // .addSubcommand((command) => applyLocalizedBuilder(command, 'commands/names/admin:experience_bonus_channel', 'commands/descriptions/admin:experience_bonus_channel')
                    //     .addStringOption((option) => applyLocalizedBuilder(option, 'commands/options/admin:bonus_channel_module', 'commands/options/admin:bonus_channel_module_description')
                    //         .setRequired(true)
                    //         .addChoices(
                    //             { name: 'Voice', value: 'Voice' },
                    //             { name: 'Text', value: 'Text' }
                    //         ).setRequired(true)
                    //     )
                    //     .addChannelOption((option) => applyLocalizedBuilder(option, 'commands/options/admin:channel_bonus', 'commands/options/admin:channel_bonus_description').setRequired(true))
                    // )
                    .addSubcommand((command) => applyLocalizedBuilder(command, 'commands/names/admin:experience_bonus_role_add', 'commands/descriptions/admin:experience_bonus_role_add')
                        .addRoleOption((option) => applyLocalizedBuilder(option, 'commands/options/admin:role_bonus', 'commands/options/admin:role_bonus_description').setRequired(true))
                        .addStringOption((option) => applyLocalizedBuilder(option, 'commands/options/admin:bonus_role_module', 'commands/options/admin:bonus_role_module_description').addChoices(
                            { name: 'Voice', value: 'Voice' },
                            { name: 'Text', value: 'Text' }
                        ).setRequired(true))
                    )
                    .addSubcommand((command) => applyLocalizedBuilder(command, 'commands/names/admin:experience_bonus_role_remove', 'commands/descriptions/admin:experience_bonus_role_remove')
                        .addRoleOption((option) => applyLocalizedBuilder(option, 'commands/options/admin:role_bonus', 'commands/options/admin:role_bonus_description').setRequired(true))
                        .addStringOption((option) => applyLocalizedBuilder(option, 'commands/options/admin:bonus_role_module', 'commands/options/admin:bonus_role_module_description').addChoices(
                            { name: 'Voice', value: 'Voice' },
                            { name: 'Text', value: 'Text' }
                        ).setRequired(true))
                    )
                    .addSubcommand((command) => applyLocalizedBuilder(command, 'commands/names/admin:experience_filter_channel_add', 'commands/descriptions/admin:experience_filter_channel_add')
                        .addChannelOption((option) => applyLocalizedBuilder(option, 'commands/options/admin:channel_filter', 'commands/options/admin:channel_filter_description').setRequired(true).addChannelTypes(ChannelType.GuildVoice).addChannelTypes(ChannelType.GuildText))
                        .addStringOption((option) => applyLocalizedBuilder(option, 'commands/options/admin:filter_channel_module', 'commands/options/admin:filter_channel_module_description').addChoices(
                            { name: 'Voice', value: 'Voice' },
                            { name: 'Text', value: 'Text' }
                        ).setRequired(true))
                    )
                    .addSubcommand((command) => applyLocalizedBuilder(command, 'commands/names/admin:experience_filter_channel_remove', 'commands/descriptions/admin:experience_filter_channel_remove')
                        .addChannelOption((option) => applyLocalizedBuilder(option, 'commands/options/admin:channel_filter', 'commands/options/admin:channel_filter_description').setRequired(true).addChannelTypes(ChannelType.GuildVoice).addChannelTypes(ChannelType.GuildText))
                        .addStringOption((option) => applyLocalizedBuilder(option, 'commands/options/admin:filter_channel_module', 'commands/options/admin:filter_channel_module_description').addChoices(
                            { name: 'Voice', value: 'Voice' },
                            { name: 'Text', value: 'Text' }
                        ).setRequired(true))
                    )
                )
                // .addSubcommandGroup((group) => applyLocalizedBuilder(group, 'commands/names/admin:text_leaderboard', 'commands/descriptions/admin:text_leaderboard')
                //     .addSubcommand((command) => applyLocalizedBuilder(command, 'commands/names/admin:text_leaderboard_daily', 'commands/descriptions/admin:text_leaderboard_daily')
                //         .addChannelOption((option) => applyLocalizedBuilder(option, 'commands/options/admin:channel_daily_text', 'commands/options/admin:channel_daily_text_description').setRequired(true))
                //     )
                //     .addSubcommand((command) => applyLocalizedBuilder(command, 'commands/names/admin:text_leaderboard_weekly', 'commands/descriptions/admin:text_leaderboard_weekly')
                //         .addChannelOption((option) => applyLocalizedBuilder(option, 'commands/options/admin:channel_weekly_text', 'commands/options/admin:channel_weekly_text_description').setRequired(true))
                //     )
                //     .addSubcommand((command) => applyLocalizedBuilder(command, 'commands/names/admin:text_leaderboard_monthly', 'commands/descriptions/admin:text_leaderboard_monthly')
                //         .addChannelOption((option) => applyLocalizedBuilder(option, 'commands/options/admin:channel_monthly_text', 'commands/options/admin:channel_monthly_text_description').setRequired(true))
                //     )
                // )
                .addSubcommandGroup((group) => applyLocalizedBuilder(group, 'commands/names/admin:voice_leaderboard', 'commands/descriptions/admin:voice_leaderboard')
                    .addSubcommand((command) => applyLocalizedBuilder(command, 'commands/names/admin:voice_leaderboard_daily', 'commands/descriptions/admin:voice_leaderboard_daily')
                        .addChannelOption((option) => applyLocalizedBuilder(option, 'commands/options/admin:channel_daily_voice', 'commands/options/admin:channel_description_daily_voice').setRequired(true).addChannelTypes(ChannelType.GuildText))
                    )
                    .addSubcommand((command) => applyLocalizedBuilder(command, 'commands/names/admin:voice_leaderboard_weekly', 'commands/descriptions/admin:voice_leaderboard_weekly')
                        .addChannelOption((option) => applyLocalizedBuilder(option, 'commands/options/admin:channel_weekly_voice', 'commands/options/admin:channel_description_weekly_voice').setRequired(true).addChannelTypes(ChannelType.GuildText))
                    )
                    .addSubcommand((command) => applyLocalizedBuilder(command, 'commands/names/admin:voice_leaderboard_monthly', 'commands/descriptions/admin:voice_leaderboard_monthly')
                        .addChannelOption((option) => applyLocalizedBuilder(option, 'commands/options/admin:channel_monthly_voice', 'commands/options/admin:channel_description_monthly_voice').setRequired(true).addChannelTypes(ChannelType.GuildText))
                    )
                )
                .addSubcommandGroup((group) => applyLocalizedBuilder(group, 'commands/names/admin:setup', 'commands/descriptions/admin:setup')
                    // .addSubcommand((command) => applyLocalizedBuilder(command, 'commands/names/admin:setup_logs', 'commands/descriptions/admin:setup_logs')
                    //     .addChannelOption((option) => applyLocalizedBuilder(option, 'commands/options/admin:channel_logs', 'commands/options/admin:channel_description_logs').setRequired(true))
                    // )
                    .addSubcommand((command) => applyLocalizedBuilder(command, 'commands/names/admin:setup_voices', 'commands/descriptions/admin:setup_voices')
                    )
                    .addSubcommand((command) => applyLocalizedBuilder(command, 'commands/names/admin:setup_prefix', 'commands/descriptions/admin:setup_prefix')
                        .addStringOption((option) => applyLocalizedBuilder(option, 'commands/options/admin:prefix', 'commands/options/admin:prefix_description').setRequired(true))
                    )
                    .addSubcommand((command) => applyLocalizedBuilder(command, 'commands/names/admin:setup_language', 'commands/descriptions/admin:setup_language')
                        .addStringOption((option) => applyLocalizedBuilder(option, 'commands/options/admin:language', 'commands/options/admin:language_description')
                            .setRequired(true)
                            .addChoices(
                                { name: 'English', value: 'en-US' },
                                { name: 'Spanish', value: 'es-ES' }
                            ).setRequired(true)
                        )
                    )
                )
                .addSubcommandGroup((group) => applyLocalizedBuilder(group, 'commands/names/admin:blacklist', 'commands/descriptions/admin:blacklist')
                    .addSubcommand((command) => applyLocalizedBuilder(command, 'commands/names/admin:bl_add', 'commands/descriptions/admin:bl_add')
                        .addUserOption((option) => applyLocalizedBuilder(option, 'commands/options/admin:bl_user_add', 'commands/options/admin:bl_user_description_add').setRequired(true))
                    )
                    .addSubcommand((command) => applyLocalizedBuilder(command, 'commands/names/admin:bl_remove', 'commands/descriptions/admin:bl_remove')
                        .addUserOption((option) => applyLocalizedBuilder(option, 'commands/options/admin:bl_user_remove', 'commands/options/admin:bl_user_description_remove').setRequired(true))
                    )
                )
                .addSubcommandGroup((group) => applyLocalizedBuilder(group, 'commands/names/admin:enable', 'commands/descriptions/admin:enable')
                    .addSubcommand((command) => applyLocalizedBuilder(command, 'commands/names/admin:enable_command', 'commands/descriptions/admin:enable_command')
                        .addStringOption((option) => applyLocalizedBuilder(option, 'commands/options/admin:enable_command', 'commands/options/admin:command_description_enable').setRequired(true))
                    )
                    .addSubcommand((command) => applyLocalizedBuilder(command, 'commands/names/admin:enable_module', 'commands/descriptions/admin:enable_module')
                        .addStringOption((option) => applyLocalizedBuilder(option, 'commands/options/admin:enable_module', 'commands/options/admin:module_description_enable').setRequired(true)
                            .setChoices(
                                { name: 'Voice Experience', value: 'voicexp' },
                                { name: 'Text Experience', value: 'textxp' },
                                { name: "Temporal Voice Channels", value: "voice" }
                            )
                        )
                    )
                )
                .addSubcommandGroup((group) => applyLocalizedBuilder(group, 'commands/names/admin:disable', 'commands/descriptions/admin:disable')
                    .addSubcommand((command) => applyLocalizedBuilder(command, 'commands/names/admin:disable_command', 'commands/descriptions/admin:disable_command')
                        .addStringOption((option) => applyLocalizedBuilder(option, 'commands/options/admin:disable_command', 'commands/options/admin:command_description_disable').setRequired(true))
                    )
                    .addSubcommand((command) => applyLocalizedBuilder(command, 'commands/names/admin:disable_module', 'commands/descriptions/admin:disable_module')
                        .addStringOption((option) => applyLocalizedBuilder(option, 'commands/options/admin:disable_module', 'commands/options/admin:module_description_disable').setRequired(true)
                            .setChoices(
                                { name: 'Voice Experience', value: 'voicexp' },
                                { name: 'Text Experience', value: 'textxp' },
                                { name: "Temporal Voice Channels", value: "voice" }
                            )
                        )
                    )
                )
                .addSubcommandGroup((group) => applyLocalizedBuilder(group, 'commands/names/admin:badge', 'commands/descriptions/admin:badge')
                    .addSubcommand((command) => applyLocalizedBuilder(command, 'commands/names/admin:badge_add', 'commands/descriptions/admin:badge_add')
                        .addAttachmentOption((option) => applyLocalizedBuilder(option, 'commands/options/admin:badge_option', 'commands/options/admin:badge_option_description').setRequired(true))
                    )
                    .addSubcommand((command) => applyLocalizedBuilder(command, 'commands/names/admin:badge_remove', 'commands/descriptions/admin:badge_remove')
                    )
                )
        );
    }
}
