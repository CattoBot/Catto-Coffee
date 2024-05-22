import { CommandOptions } from "@sapphire/framework";
import { PermissionFlagsBits } from "discord.js";

export class Commands {
    public static Latency: CommandOptions = {
        name: 'latency',
        description: 'Check bot latency',
        requiredClientPermissions: [PermissionFlagsBits.SendMessages],
        requiredUserPermissions: [PermissionFlagsBits.SendMessages],
        preconditions: ['GuildExistsPrecondition', 'GuildBlacklistPrecondition', 'UserBlacklistPrecondition', 'GuildUserBlacklistPrecondition', 'RoleCommandPermitPrecondition'],
        cooldownDelay: 5000
    }

    public static WebHookCommand = {
        name: 'webhook',
        description: 'create webhook',
        requiredClientPermissions: [PermissionFlagsBits.Administrator],
        requiredUserPermissions: [PermissionFlagsBits.Administrator],
    }

    public static Rank = {
        name: 'rank',
        description: 'Check your current level and experience.',
        requiredClientPermissions: [PermissionFlagsBits.Administrator],
        requiredUserPermissions: [PermissionFlagsBits.SendMessages],
    }
}
