import { SubcommandOptions } from "@sapphire/plugin-subcommands";
import { SubcommandCategories } from "@shared/enum/commands/categories.enum";
import { CommandPermissions } from "@shared/enum/commands/permissions.enum";

export class AdminSubCommandOptions {
    public static Options: SubcommandOptions = {
        name: 'manage',
        requiredClientPermissions: [CommandPermissions.Administrator],
        requiredUserPermissions: [CommandPermissions.Administrator],
        fullCategory: [SubcommandCategories.Admin],
        subcommands: [
            {
                name: "set-up",
                type: "group",
                entries: [
                    {
                        name: "logs", chatInputRun: "ChatInputLogs",
                    },
                    {
                        name: "voices", chatInputRun: "ChatInputVoices"
                    }
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
            }
        ]
    }
}