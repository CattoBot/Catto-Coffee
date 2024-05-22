import { Command, container } from '@sapphire/framework';
import { Embed } from "../../classes/Embed";
import { UserRedisManagement } from "../../classes/UserRedis";

export class AddUserToGuildBlacklistCommand {
    public static async run(interaction: Command.ChatInputCommandInteraction) {
        const userId = interaction.options.getUser('user', true).id;

        const key = `user:guild:blacklist:${userId}:${interaction.guild!.id}`;
        const isBlacklisted = await UserRedisManagement.fetchUserInRedis(key);
        const user = await UserRedisManagement.fetchUser(userId);

        if (isBlacklisted || user) {
            await interaction.reply({
                embeds: [new Embed(`The user \`${userId}\` is already blacklisted on the server \`${interaction.guild!.name}\`.`)]
            });
        } else {
            await this.addToDatabase(userId, interaction.guild!.id);
            await this.addToRedis(key);
            return await interaction.reply({
                embeds: [new Embed(`The user \`${userId}\` has been added to the blacklist on the server \`${interaction.guild!.name}\`.`)]
            });
        }

        return await interaction.reply({
            embeds: [new Embed(`An error occurred while adding the user \`${userId}\` to the blacklist on the server \`${interaction.guild!.name}\`.`)]
        });
    }

    public static async addToDatabase(userId: string, guildId: string) {
        try {
            await container.prisma.guildBlacklistedUsers.create({
                data: { userId: userId, guildId: guildId }
            });
        } catch (error) {
            console.error('Failed to add to database:', error);
        }
    }

    public static async addToRedis(key: string) {
        try {
            await container.redis.set(key, 'true');
        } catch (error) {
            console.error('Failed to add to Redis:', error);
        }
    }

}
