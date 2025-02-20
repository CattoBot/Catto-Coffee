import { Command, container } from '@sapphire/framework';
import { Embed } from '../../classes/Embed';

export class RemoveUserBlacklistCommand {
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
		}

		return await interaction.reply({
			content: 'An unexpected error occurred.',
			ephemeral: true
		});
	}

	private static async removeFromDatabase(userId: string) {
		await container.prisma.bot_black_listed_users.delete({
			where: { userId: userId }
		});
	}

	private static async removeFromRedis(key: string) {
		await container.redis.del(key);
	}

	private static async fetchUser(userId: string) {
		return await container.prisma.bot_black_listed_users.findUnique({
			where: { userId: userId }
		});
	}
}
