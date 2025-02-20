import { Precondition } from '@sapphire/framework';
import { CommandInteraction, Message } from 'discord.js';
import { Emojis } from '../shared/enum/Emojis';
import { resolveKey } from '@sapphire/plugin-i18next';

export class GuildUserBlacklistPrecondition extends Precondition {
	public override async chatInputRun(interaction: CommandInteraction) {
		return this.checkBlacklist(interaction.user.id, interaction.guild?.id, interaction);
	}

	public override async messageRun(message: Message) {
		return this.checkBlacklist(message.author.id, message.guild?.id, message);
	}

	private async checkBlacklist(userId: string, guildId: string | undefined, context: CommandInteraction | Message) {
		if (!guildId) {
			return this.ok();
		}

		const key = `user:guild:blacklist:${userId}:${guildId}`;
		const isBlacklistedInRedis = await this.container.redis.get(key);
		if (isBlacklistedInRedis) {
			return this.error({
				message: await resolveKey(context, 'preconditions/blacklist:server_user', { emoji: Emojis.ERROR })
			});
		}

		const isBlacklistedInDatabase = await this.container.prisma.guild_blacklisted_users.findUnique({
			where: { userId: userId, guildId: guildId }
		});
		if (isBlacklistedInDatabase) {
			await this.container.redis.set(key, 'true', 'EX', 3600);
			return this.error({
				message: await resolveKey(context, 'preconditions/blacklist:server_user', { emoji: Emojis.ERROR })
			});
		}

		return this.ok();
	}
}
