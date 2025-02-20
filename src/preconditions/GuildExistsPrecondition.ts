import { Precondition, PreconditionResult } from '@sapphire/framework';
import { CommandInteraction, Message } from 'discord.js';

export class GuildExistsPrecondition extends Precondition {
	private async checkGuildExists(guildId: string): Promise<PreconditionResult> {
		const cacheKey = `guild:${guildId}`;
		const cachedData = await this.container.redis.get(cacheKey);
		let guild: unknown;

		if (cachedData) {
			guild = JSON.parse(cachedData);
		} else {
			guild = await this.container.prisma.guilds.findUnique({ where: { guildId } });
			if (!guild) {
				guild = await this.container.prisma.guilds.create({ data: { guildId } });
			}
			await this.container.redis.set(cacheKey, JSON.stringify(guild), 'EX', 3600);
		}
		return this.ok();
	}

	public override async chatInputRun(interaction: CommandInteraction) {
		if (!interaction.guild) {
			return this.ok();
		}

		return this.checkGuildExists(interaction.guild.id);
	}

	public override async messageRun(message: Message) {
		if (!message.guild) {
			return this.ok();
		}

		return this.checkGuildExists(message.guild.id);
	}
}
