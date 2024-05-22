import { Command, container } from '@sapphire/framework';
import { Embed } from "../../classes/Embed";
import { UserRedisManagement } from "../../classes/UserRedis";

export class RemoveUserFromGuildBlacklistCommand {
    public static async run(interaction: Command.ChatInputCommandInteraction) {
        const userId = interaction.options.getUser('user', true).id;

        const key = `user:guild:blacklist:${userId}:${interaction.guild!.id}`;
        const isBlacklisted = await UserRedisManagement.fetchUserInRedis(key);
        const user = await UserRedisManagement.fetchUser(userId);

        if (!isBlacklisted || !user) {
            await interaction.reply({
                embeds: [new Embed(`The user \`${userId}\` is not blacklisted on the server \`${interaction.guild!.name}\`.`)]
            });
        } else {
            await this.removeFromDatabase(userId, interaction.guild!.id);
            await this.removeFromRedis(key);
            return await interaction.reply({
                embeds: [new Embed(`The user \`${userId}\` has been removed from the blacklist on the server \`${interaction.guild!.name}\`.`)]
            });
        }

        return await interaction.reply({
            embeds: [new Embed(`An error occurred while removing the user \`${userId}\` from the blacklist on the server \`${interaction.guild!.name}\`.`)]
        });
    }

    public static async removeFromDatabase(userId: string, guildId: string) {
        try {
            await container.prisma.guildBlacklistedUsers.delete({
                where: { userId: userId, guildId: guildId }
            });
        } catch (error) {
            console.error('Failed to remove from database:', error);
        }
    }

    public static async removeFromRedis(key: string) {
        try {
            await container.redis.del(key);
        } catch (error) {
            console.error('Failed to remove from Redis:', error);
        }
    }
}