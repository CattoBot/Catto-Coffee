import { Prisma, PrismaCoreModule } from "@lib/database/prisma";
import { Redis, RedisCoreModule } from "@lib/database/redis";
import { Command } from "@sapphire/framework";
import { Embed } from "@utils/embeds";

export class RemoveUserBlacklistCommand {
    private static prisma: PrismaCoreModule = Prisma;
    private static redis: RedisCoreModule = Redis;

    public static async run(interaction: Command.ChatInputCommandInteraction) {
        const userId = interaction.options.getString('user', true);

        try {
            const user = await this.fetchUser(userId);
            const User = await interaction.client.users.fetch(userId);
            const key = `blacklisted:user:${userId}`;

            if (!user) {
                await interaction.reply({
                    embeds: [new Embed(`The user \`${User.username}\`(\`${User.id}\`) is not blacklisted.`)]
                });
            } else {
                await this.removeFromDatabase(userId);
                await this.removeFromRedis(key);
               return await interaction.reply({
                    embeds: [new Embed(`The user \`${User.username}\`(\`${User.id}\`) has been removed from the blacklist.`)]
                });
            }
        } catch (error) {
            console.error('Error during user removal process:', error);
           return await interaction.reply({
                content: "Failed to remove the user from the blacklist due to an internal error.",
                ephemeral: true
            });
        }
    }

    private static async removeFromDatabase(userId: string) {
        await this.prisma.botBlackListedUsers.delete({
            where: { userId: userId }
        });
    }

    private static async removeFromRedis(key: string) {
        await this.redis.del(key);
    }

    private static async fetchUser(userId: string) {
        return await this.prisma.botBlackListedUsers.findUnique({
            where: { userId: userId }
        });
    }
}
