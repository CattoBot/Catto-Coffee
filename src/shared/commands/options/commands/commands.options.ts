import { CommandCategories } from "@shared/enum/commands/categories.enum";
import { CommandPermissions } from "@shared/enum/commands/permissions.enum";

export class Commands {
    public static PingCommand = {
        name: 'ping',
        description: 'Check bot latency',
        fullCategory: [CommandCategories.Public],
        requiredClientPermissions: [CommandPermissions.SendMessages],
        requiredUserPermissions: [CommandPermissions.SendMessages],
    }
}