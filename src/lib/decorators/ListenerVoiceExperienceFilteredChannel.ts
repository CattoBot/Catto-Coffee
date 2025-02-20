import { container } from '@sapphire/framework';
import { VoiceState } from 'discord.js';

export function FilteredVoiceChannel() {
	return function (_target: Object, _propertyKey: string, descriptor: PropertyDescriptor) {
		const originalMethod = descriptor.value;

		descriptor.value = async function (...args: [VoiceState, VoiceState]) {
			try {
				const [_oldState, newState] = args;

				if (!newState.channel) {
					return originalMethod.apply(this, args);
				}

				const channelId = newState.channel.id;
				const guildId = newState.guild.id;
				const redisKey = `filteredVoiceChannel:${guildId}:${channelId}`;
				const redisResult = await container.redis.get(redisKey);
				if (redisResult) {
					return;
				}

				const isFilteredChannel = await container.prisma.filtered_voice_channels.findUnique({
					where: {
						guildId_channelId: {
							guildId: guildId,
							channelId: channelId
						}
					}
				});

				if (isFilteredChannel) {
					await container.redis.set(redisKey, 'true');
					return;
				}

				return originalMethod.apply(this, args);
			} catch (error) {
				container.logger.error(`Error in FilteredVoiceChannel: ${error}`);
			}
		};
	};
}
