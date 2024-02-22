import { Guild, GuildChannel, PermissionFlagsBits } from "discord.js";
import { Prisma } from "@lib/services/prisma.service";

export class VoiceSetupHelper {
    public static db = Prisma.getPrisma()
    public static async createCategory(guild: Guild): Promise<GuildChannel> {
        return await guild?.channels.create({
            name: 'Crea tu canal',
            type: 4,
        });
    }

    public static async createVoiceChannel(guild: Guild, categoryId: string): Promise<GuildChannel> {
        return await guild?.channels.create({
            name: '🔉・Únete para Crear',
            parent: categoryId,
            type: 2,
            permissionOverwrites: [{
                id: guild.roles.everyone.id,
                allow: PermissionFlagsBits.Connect,
            }],
        });
    }

    public static async createDatabaseEntry(guild: Guild, channel: GuildChannel, category: GuildChannel): Promise<void> {
        await VoiceSetupHelper.db.tempChannel.create({
            data: {
                guildId: guild?.id,
                id: channel?.id,
                categoryId: category?.id
            },
        });
    }
}