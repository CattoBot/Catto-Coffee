import { GuildBlacklistedUsers } from "@prisma/client";
import { container } from "@sapphire/framework";

export class UserRedisManagement {
    public static async fetchUserInRedis(key: string): Promise<boolean> {
        try {
            const result = await container.redis.get(key);
            return result === 'true';
        } catch (error) {
            console.error('Failed to fetch from Redis:', error);
            return false; // Add a return statement with a default value of false
        }
    }

    public static async fetchUser(userId: string): Promise<GuildBlacklistedUsers | null> {
        try {
            return await container.prisma.guildBlacklistedUsers.findUnique({ where: { userId: userId } });
        } catch (error) {
            console.error('Failed to fetch from database:', error);
            return null; // Add a return statement with a default value of null
        }
    }
}