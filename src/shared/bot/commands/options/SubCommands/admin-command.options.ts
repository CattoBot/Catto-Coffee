import { SubcommandOptions } from "@sapphire/plugin-subcommands";
import { PermissionFlagsBits } from "discord.js";

export class AdminSubCommandOptions {
    public static Options: SubcommandOptions = {
        name: 'manage',
        description: 'Manage the bot interactions in the server',
        requiredClientPermissions: [PermissionFlagsBits.ManageGuild],
        requiredUserPermissions: [PermissionFlagsBits.ManageGuild],
        subcommands: [
            {
                name: "def", messageRun: "messageRunShow", default: true
            },
            {
                name: "voice-roles",
                type: "group",
                entries: [
                    {
                        name: "add", chatInputRun: "ChatInputAddVoiceRole"
                    },
                    {
                        name: "remove", chatInputRun: "ChatInputRemoveVoiceRole"
                    }
                ]
            },
            {
                name: "text-roles",
                type: "group",
                entries: [
                    {
                        name: "add", chatInputRun: "ChatInputAddTextRole"
                    },
                    {
                        name: "remove", chatInputRun: "ChatInputRemoveVoiceRole"
                    }
                ]
            },
            {
                name: "experience",
                type: "group",
                entries: [
                    {
                        name: "text", chatInputRun: "ChatInputTextExperience"
                    },
                    {
                        name: "voice", chatInputRun: "ChatInputVoiceExperience"
                    },
                    {
                        name: "bonus-channel", chatInputRun: "ChatInputBonusChannel"
                    },
                    {
                        name: "bonus-role-add", chatInputRun: "ChatInputBonusRoleAdd"
                    },
                    {
                        name: "bonus-role-remove", chatInputRun: "ChatInputBonusRoleRemove"
                    },
                    {
                        name: "channel-filter-add", chatInputRun: "ChatInputFilteredChannelAdd"
                    },
                    {
                        name: "channel-filter-remove", chatInputRun: "ChatInputFilteredChannelRemove"
                    },
                    {
                        name: "reset-user", chatInputRun: "ChatInputResetUserExperience"
                    },
                    {
                        name: "reset-server", chatInputRun: "ChatInputResetGuildExperience"
                    }
                ]
            },
            // {
            //     name: "text-leaderboard",
            //     type: "group",
            //     entries: [
            //         {
            //             name: "daily", chatInputRun: "ChatInputAddDailyLeaderboard"
            //         },
            //         {
            //             name: "weekly", chatInputRun: "ChatInputAddWeeklyLeaderboard",
            //         },
            //         {
            //             name: "monthly", chatInputRun: "ChatInputAddMonthlyLeaderboard",
            //         }
            //     ]
            // },
            {
                name: "voice-leaderboard",
                type: "group",
                entries: [
                    {
                        name: "daily", chatInputRun: "ChatInputAddDailyLeaderboard"
                    },
                    {
                        name: "weekly", chatInputRun: "ChatInputAddWeeklyLeaderboard"
                    },
                    {
                        name: "monthly", chatInputRun: "ChatInputAddMonthlyLeaderboard",
                    }
                ]
            },
            {
                name: "set",
                type: "group",
                entries: [
                    {
                        name: "logs", chatInputRun: "ChatInputLogs", messageRun: "MessageRunLogs"
                    },
                    {
                        name: "voices", chatInputRun: "ChatInputVoices", messageRun: "MessageVoices"
                    },
                    {
                        name: "prefix", chatInputRun: "ChatInputPrefix", messageRun: "MessageRunPrefix"
                    },
                    {
                        name: "language", chatInputRun: "ChatInputLanguage", messageRun: "MessageRunLanguage"
                    },
                ]
            },
            {
                name: "blacklist",
                type: "group",
                entries: [
                    {
                        name: "add", chatInputRun: "ChatInputAddUserToGuildBlacklist"
                    },
                    {
                        name: "remove", chatInputRun: "ChatRemoveUserFromGuildBlacklist"
                    }
                ]
            },
            {
                name: "enable",
                type: "group",
                entries: [
                    {
                        name: "command", chatInputRun: "ChatInputEnableCommand", messageRun: "MessageEnableCommand"
                    },
                    {
                        name: "module", chatInputRun: "ChatInputEnableModule", messageRun: "MessageEnableModule"
                    }
                ]
            },
            {
                name: "disable",
                type: "group",
                entries: [
                    {
                        name: "command", chatInputRun: "ChatInputDisableCommand", messageRun: "MessageEnableCommand"
                    },
                    {
                        name: "module", chatInputRun: "ChatInputDisableModule", messageRun: "MessageEnableModule"
                    }
                ]
            },
            {
                name: "badge",
                type: "group",
                entries: [
                    {
                        name: "add", chatInputRun: "ChatInputAddBadge"
                    },
                    {
                        name: "remove", chatInputRun: "ChatInputRemoveBadge"
                    }
                ]
            }
        ]
    }
}