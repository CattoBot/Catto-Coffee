import { Command, container } from "@sapphire/framework";
import { Embed } from "../../classes/Embed";
import { User } from "discord.js";

export class AddUserBlacklistCommand {
    public static async run(interaction: Command.ChatInputCommandInteraction) {
        const userId = interaction.options.getString('user', true);

        let user: User;
        try {
            user = await interaction.client.users.fetch(userId);
        } catch (error) {
            console.error('Error fetching user:', error);
            await interaction.reply({
                content: "Failed to fetch the user with the provided ID. Please ensure it's correct and that the user exists.",
                ephemeral: true
            });
            return;
        }

        try {
            const isBlacklisted = await this.checkRedisBlacklist(userId);
            if (isBlacklisted) {
                await interaction.reply({
                    embeds: [new Embed(`The user \`${user.username}\`(\`${userId}\`) is already blacklisted.`)]
                });
            } else {
                await this.addToDatabase(userId);
                await this.addToRedis(userId);
                return await interaction.reply({
                    embeds: [new Embed(`The user \`${user.username}\`(\`${userId}\`) has been added to the blacklist.`)]
                });
            }
        } catch (error) {
            console.error('Error during blacklist checking or updating:', error);
            return await interaction.reply({
                content: "Failed to update the blacklist due to an internal error.",
                ephemeral: true
            });
        }

        return await interaction.reply({
            content: 'An unexpected error occurred.',
            ephemeral: true
        });
    }

    private static async addToDatabase(userId: string) {
        await container.prisma.bot_black_listed_users.create({
            data: { userId: userId }
        });
    }

    private static async addToRedis(userId: string) {
        await container.redis.set(`blacklisted:user:${userId}`, 'true', 'EX', 3600);
    }

    public static async checkRedisBlacklist(userId: string): Promise<boolean> {
        const result = await container.redis.get(`blacklisted:user:${userId}`);
        return result === 'true';
    }
}
