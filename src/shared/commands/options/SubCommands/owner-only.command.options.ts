import { SubcommandOptions } from "@sapphire/plugin-subcommands";
import { SubcommandCategories } from "@shared/enum/commands/categories.enum";
import { CommandPermissions } from "@shared/enum/commands/permissions.enum";

export class OwnerOnlyCommandsOptions {
    public static Options: SubcommandOptions = {
        name: 'blacklist',
        requiredClientPermissions: [CommandPermissions.Administrator],
        requiredUserPermissions: [CommandPermissions.Administrator],
        fullCategory: [SubcommandCategories.Owner],
        subcommands: [
            {
                name: "add",
                type: "group",
                entries: [
                    {
                        name: "server", chatInputRun: "ChatInputServer",
                    },
                    {
                        name: "user", chatInputRun: "ChatInputUser"
                    },
                ],
            },
            {
                name: "remove",
                type: "group",
                entries: [
                    {
                        name: "server", chatInputRun: "ChatInputRemoveServer"
                    },
                    {
                        name: "user", chatInputRun: "ChatInputRemoveUser"
                    }
                ]
            }

        ],
        preconditions: []
    }
}