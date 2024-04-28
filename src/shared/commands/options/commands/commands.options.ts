import { CommandOptions } from "@sapphire/framework";
import { CommandCategories } from "@shared/enum/commands/categories.enum";
import { CommandPermissions } from "@shared/enum/commands/permissions.enum";

export class Commands {
    public static PingCommand: CommandOptions = {
        name: 'ping',
        description: 'Check bot latency',
        fullCategory: [CommandCategories.Public],
        requiredClientPermissions: [CommandPermissions.SendMessages],
        requiredUserPermissions: [CommandPermissions.SendMessages],
        preconditions: ['GuildExistsPrecondition','GuildBlacklistPrecondition', 'UserBlacklistPrecondition', 'GuildUserBlacklistPrecondition', 'RolePermitCommandPrecondition'],
        cooldownDelay: 5000
    }

    public static WebHookCommand = {
        name: 'webhook',
        description: 'create webhook',
        fullCategory: [CommandCategories.Public],
        requiredClientPermissions: [CommandPermissions.Administrator],
        requiredUserPermissions: [CommandPermissions.Administrator],
    }

    public static Level = {
        name: 'rank',
        description: 'Check your current level and experience.',
        fullCategory: [CommandCategories.Public],
        requiredClientPermissions: [CommandPermissions.Administrator],
        requiredUserPermissions: [CommandPermissions.SendMessages],
    }
}
