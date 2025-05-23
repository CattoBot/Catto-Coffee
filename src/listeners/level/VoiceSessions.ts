import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { Events, VoiceChannel } from 'discord.js';
import { FilteredVoiceChannels } from '../../lib/decorators/FilteredVoiceChannelCheck';

@ApplyOptions<Listener.Options>({ event: Events.ClientReady, once: true })
export class VoiceSessionsListener extends Listener<typeof Events.ClientReady> {
	@FilteredVoiceChannels()
	public async run() {
		this.container.console.await('Bot is ready. Checking for users in voice channels without session keys.');

		for (const guild of this.container.client.guilds.cache.values()) {
			for (const channel of guild.channels.cache.values()) {
				if (channel instanceof VoiceChannel) {
					for (const [memberId, member] of channel.members) {
						if (!member.user.bot) {
							const sessionId = `voiceSession:${memberId}:${guild.id}`;
							const sessionData = await this.container.redis.get(sessionId);
							if (!sessionData) {
								await this.container.redis.set(sessionId, JSON.stringify({ startTime: Date.now() }));
							}
						}
					}
				}
			}
		}

		this.container.console.success('Finished checking for users in voice channels without session keys.');
	}
}
