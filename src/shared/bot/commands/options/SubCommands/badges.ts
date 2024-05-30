import { SubcommandOptions } from "@sapphire/plugin-subcommands";
import { PermissionFlagsBits } from "discord.js";

export class BadgesOwnerCommand {
    public static Options: SubcommandOptions = {
        name: 'badges',
        requiredClientPermissions: [PermissionFlagsBits.Administrator],
        requiredUserPermissions: [PermissionFlagsBits.Administrator],
        subcommands: [
            {
                name: "create", chatInputRun: "ChatInputCreate",
            },
            {
                name: "assign", chatInputRun: "ChatInputAssign"
            },
            {
                name: "remove", chatInputRun: "ChatInputRemove"
            },
            {
                name: "list", chatInputRun: "ChatInputList"
            }
        ]
    }
}