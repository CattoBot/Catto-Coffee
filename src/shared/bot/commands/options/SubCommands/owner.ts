import { SubcommandOptions } from "@sapphire/plugin-subcommands";
import { PermissionFlagsBits } from "discord.js";

export class OwnerOnlyCommandsOptions {
    public static Options: SubcommandOptions = {
        name: 'blacklist',
        requiredClientPermissions: [PermissionFlagsBits.Administrator],
        requiredUserPermissions: [PermissionFlagsBits.Administrator],
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
        preconditions: ['OwnerOnlyPrecondition']
    }
}