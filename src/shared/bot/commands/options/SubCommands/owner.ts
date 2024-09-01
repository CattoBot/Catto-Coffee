import { SubcommandOptions } from "@sapphire/plugin-subcommands";
import { PermissionFlagsBits } from "discord.js";

export class OwnerSubCommandOptions {
    public static Options: SubcommandOptions = {
        name: 'owner',
        requiredClientPermissions: [PermissionFlagsBits.Administrator],
        requiredUserPermissions: [PermissionFlagsBits.Administrator],
        subcommands: [
            {
                name: "sanction",
                type: "group",
                entries: [
                    {
                        name: "add", chatInputRun: "ChatInputOwnerSanctionAdd",
                    },
                    {
                        name: "remove", chatInputRun: "ChatInputOwnerSanctionRemove"
                    },
                ],
            },
            {
                name: "badges",
                type: "group",
                entries: [
                    {
                        name: "add", chatInputRun: "ChatInputOwnerBadgesAdd"
                    },
                    {
                        name: "remove", chatInputRun: "ChatInputOwnerBadgesRemove"
                    }
                ]
            }
        ],
        preconditions: ['OwnerOnlyPrecondition']
    }
}