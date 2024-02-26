import { Guild, GuildChannel, PermissionFlagsBits } from "discord.js";
import { PrismaClient } from "@prisma/client";

export class VoiceSetupHelper {
    public static prisma: PrismaClient = new PrismaClient();

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
        try {
            await this.prisma.tempChannel.create({
                data: {
                    id: channel.id,
                    guildId: guild.id,
                    categoryId: category.id,
                }
            })
        } catch (error) {
            console.error(error);
        }
    }
}