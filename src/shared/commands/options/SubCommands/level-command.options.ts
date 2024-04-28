import { SubcommandOptions } from "@sapphire/plugin-subcommands";
import { SubcommandCategories } from "@shared/enum/commands/categories.enum";
import { CommandPermissions } from "@shared/enum/commands/permissions.enum";

export class LevelSubCommands {
    public static Options: SubcommandOptions = {
        name: 'level',
        requiredClientPermissions: [CommandPermissions.ManageGuild],
        requiredUserPermissions: [CommandPermissions.SendMessages],
        fullCategory: [SubcommandCategories.Level],
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