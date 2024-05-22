import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener } from '@sapphire/framework';
import { Guild } from 'discord.js';

@ApplyOptions<Listener.Options>({ event: Events.GuildDelete })
export class GuildDestroyListener extends Listener<typeof Events.GuildDelete> {
	public override async run(guild: Guild) {
		await this.deleteBadges(guild.id);
		await this.container.cloudinary.deleteImage(guild.id);
	}

	private async deleteBadges(guildId: string) {
		try {
			await this.container.prisma.$transaction(async (prisma) => {
				await prisma.guildBadges.deleteMany({
					where: {
						guildId
					}
				});
				await prisma.badges.deleteMany({
					where: {
						name: guildId
					}
				});
			});
		} catch (error) {
			return;
		}
	}
}
