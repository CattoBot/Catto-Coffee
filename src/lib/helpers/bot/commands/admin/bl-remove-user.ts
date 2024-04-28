import { Prisma, PrismaCoreModule } from "@lib/database/prisma";
import { Redis, RedisCoreModule } from "@lib/database/redis";
import { GuildBlacklistedUsers } from "@prisma/client";
import { Command } from "@sapphire/framework";
import { Embed } from "@utils/embeds";

export class RemoveUserFromGuildBlacklistCommand {
    private static prisma: PrismaCoreModule = Prisma;
    private static redis: RedisCoreModule = Redis;

    public static async run(interaction: Command.ChatInputCommandInteraction) {
        const userId = interaction.options.getUser('user', true).id;

        const key = `user:guild:blacklist:${userId}:${interaction.guild.id}`;
        const isBlacklisted = await this.fetchUserInRedis(key);
        const user = await this.fetchUser(userId);
        
        if (!isBlacklisted || !user) {
            await interaction.reply({
                embeds: [new Embed(`The user \`${userId}\` is not blacklisted on the server \`${interaction.guild.name}\`.`)]
            });
        } else {
            await this.removeFromDatabase(userId, interaction.guild.id);
            await this.removeFromRedis(key);
            return await interaction.reply({
                embeds: [new Embed(`The user \`${userId}\` has been removed from the blacklist on the server \`${interaction.guild.name}\`.`)]
            });
        }
    }

    public static async removeFromDatabase(userId: string, guildId: string) {
        try {
            await this.prisma.guildBlacklistedUsers.delete({
                where: { userId: userId, guildId: guildId  }
            });
        } catch (error) {
            console.error('Failed to remove from database:', error);
        }
    }

    public static async removeFromRedis(key: string) {
        try {
            await this.redis.del(key);
        } catch (error) {
            console.error('Failed to remove from Redis:', error);
        }
    }

    public static async fetchUserInRedis(key: string): Promise<boolean> {
        try {
            const result = await this.redis.get(key);
            return result === 'true';
        } catch (error) {
            console.error('Failed to fetch from Redis:', error);
        }
    }

    public static async fetchUser(userId: string): Promise<GuildBlacklistedUsers | null> {
        try {
            return await this.prisma.guildBlacklistedUsers.findUnique({ where: { userId: userId } });
        } catch (error) {
            console.error('Failed to fetch from database:', error);
        }
    }
}