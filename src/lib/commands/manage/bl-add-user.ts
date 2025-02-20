import { Command, container } from '@sapphire/framework';
import { Embed } from '../../classes/Embed';
import { UserRedisService } from '../../services/UserRedis';
import { resolveKey } from '@sapphire/plugin-i18next';
import { Emojis } from '../../../shared/enum/Emojis';

export class AddUserToGuildBlacklistCommand {
	public static async run(interaction: Command.ChatInputCommandInteraction) {
		const userId = interaction.options.getUser('user', true).id;

		const key = `user:guild:blacklist:${userId}:${interaction.guild!.id}`;
		const isBlacklisted = await UserRedisService.fetchUserInRedis(key);
		const user = await UserRedisService.fetchUser(userId);
		const fetchedUser = await container.client.users.fetch(userId);
		if (isBlacklisted || user) {
			const message = await resolveKey(interaction, `commands/replies/error:already_backlisted_user`, {
				emoji: Emojis.ERROR,
				user: fetchedUser.displayName
			});
			await interaction.reply({
				embeds: [new Embed(message)]
			});
		} else {
			await this.addToDatabase(userId, interaction.guild!.id);
			await this.addToRedis(key);
			const message = await resolveKey(interaction, `commands/replies/admin:user_added_to_blacklist`, { user: userId, emoji: Emojis.SUCCESS });
			return await interaction.reply({
				embeds: [new Embed(message)]
			});
		}

		return await interaction.reply({
			embeds: [
				new Embed(
					`An error occurred while adding the user \`${fetchedUser.displayName}\` to the blacklist on the server \`${interaction.guild!.name}\`.`
				)
			]
		});
	}

	public static async addToDatabase(userId: string, guildId: string) {
		try {
			await container.prisma.guild_blacklisted_users.create({
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
