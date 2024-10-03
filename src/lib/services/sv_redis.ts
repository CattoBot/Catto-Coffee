import { guild_blacklisted_users } from "@prisma/client";
import { container } from "@sapphire/framework";

export default class UserRedisService {
    public static async fetchUserInRedis(key: string): Promise<boolean> {
        try {
            const result = await container.redis.get(key);
            return result === 'true';
        } catch (error) {
            container.console.error('Failed to fetch from Redis:', error);
            return false; 
        }
    }

    public static async fetchUser(userId: string): Promise<guild_blacklisted_users | null> {
        try {
            return await container.prisma.guild_blacklisted_users.findUnique({ where: { userId: userId } });
        } catch (error) {
            container.console.error('Failed to fetch from database:', error);
            return null; 
        }
    }
}