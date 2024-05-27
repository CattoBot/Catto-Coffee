import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener } from '@sapphire/framework';
import { Guild } from 'discord.js';

@ApplyOptions<Listener.Options>({ event: Events.GuildDelete })
export class GuildDestroyListener extends Listener<typeof Events.GuildDelete> {
	public override async run(guild: Guild) {
		await this.deleteBadges(guild.id);
		await this.container.cloudinary.deleteImage(guild.id);
		await this.deleteTempChannels(guild.id);
		await this.deleteTempVoiceConfig(guild.id);
	}

	private async deleteBadges(guildId: string) {
		try {
			await this.container.prisma.$transaction(async (prisma) => {
				await prisma.guild_badges.deleteMany({
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

	private async deleteTempVoiceConfig(guildId: string) {
		try {
			await this.container.prisma.i_voice_temp_channels.deleteMany({
				where: {
					guildId
				}
			});
		} catch (error) {
			return;
		}
	}

	private async deleteTempChannels(guildId: string) {
		try {
			await this.container.prisma.voice_temp_channels.deleteMany({
				where: {
					guildId
				}
			});
		} catch (error) {
			return;
		}
	}
}
