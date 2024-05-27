import { Command, container } from '@sapphire/framework';
import { Embed } from "../../classes/Embed";
import { UserRedisService } from '../../services/UserRedis';
import { resolveKey } from '@sapphire/plugin-i18next';
import { Emojis } from '../../../shared/enum/Emojis';


export class RemoveUserFromGuildBlacklistCommand {
    public static async run(interaction: Command.ChatInputCommandInteraction) {
        const userId = interaction.options.getUser('user', true).id;

        const key = `user:guild:blacklist:${userId}:${interaction.guild!.id}`;
        const isBlacklisted = await UserRedisService.fetchUserInRedis(key);
        const user = await UserRedisService.fetchUser(userId);
        const fetchUser = await container.client.users.fetch(userId);
        if (!isBlacklisted || !user) {
            const message = await resolveKey(interaction, `commands/replies/error:user_not_blacklisted`, { emoji: Emojis.ERROR, user: fetchUser.displayName });
            await interaction.reply({
                embeds: [new Embed(message)]
            });
        } else {
            const message = await resolveKey(interaction, `commands/replies/admin:user_removed_from_blacklist`, { user: userId, emoji: Emojis.SUCCESS });
            await this.removeFromDatabase(userId, interaction.guild!.id);
            await this.removeFromRedis(key);
            return await interaction.reply({
                embeds: [new Embed(message)]
            });
        }

        return await interaction.reply({
            embeds: [new Embed(`An error occurred while removing the user \`${userId}\` from the blacklist on the server \`${interaction.guild!.name}\`.`)]
        });
    }

    public static async removeFromDatabase(userId: string, guildId: string) {
        try {
            await container.prisma.guild_blacklisted_users.delete({
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