import { SubcommandOptions } from "@sapphire/plugin-subcommands";
import { PermissionFlagsBits } from "discord.js";

export class LevelSubCommands {
    public static Options: SubcommandOptions = {
        name: 'catto',
        requiredClientPermissions: [PermissionFlagsBits.ManageGuild],
        requiredUserPermissions: [PermissionFlagsBits.SendMessages],
        preconditions: ['GuildOnly', 'GuildExistsPrecondition', 'GuildBlacklistPrecondition', 'UserBlacklistPrecondition', 'GuildUserBlacklistPrecondition', 'RoleCommandPermitPrecondition'],
        subcommands: [
            {
                name: "rank", chatInputRun: "ChatInputRank", cooldownDelay: 10000
            },
            {
                name: "leaderboard", chatInputRun: "ChatInputLeaderboard"
            },
            {
                name: "rewards", chatInputRun: "ChatInputRewards"
            },
        ]
    }
}