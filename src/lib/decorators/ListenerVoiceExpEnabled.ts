import { container } from '@sapphire/framework';
import type { VoiceState } from 'discord.js';
import type { PrismaClient } from '@prisma/client';
import type { Redis } from 'ioredis';

interface VoiceStateHandler {
	(oldState: VoiceState, newState: VoiceState): Promise<void>;
}

function EnabledVoiceListenerExperience() {
	return function (_target: Object, _propertyKey: string, descriptor: PropertyDescriptor) {
		const originalMethod: VoiceStateHandler = descriptor.value;
		const prisma: PrismaClient = container.prisma;
		const redis: Redis = container.redis;

		descriptor.value = async function (oldState: VoiceState, newState: VoiceState): Promise<void> {
			try {
				if (!newState.guild || newState.member?.user.bot) return;

				const guildId = newState.guild.id;
				const cacheKey = `guild:${guildId}:voiceXPEnabled`;
				const cachedEnabled = await redis.get(cacheKey);

				let isEnabled: boolean;

				if (cachedEnabled !== null) {
					isEnabled = JSON.parse(cachedEnabled);
				} else {
					const result = await prisma.i_voice_experience.findUnique({ where: { guildId } });
					isEnabled = result?.isEnabled ?? false;
					await redis.set(cacheKey, JSON.stringify(isEnabled), 'EX', 3600); // Cache for 1 hour
				}

				if (isEnabled) {
					return originalMethod.call(this, oldState, newState);
				}
			} catch (error) {
				container.logger.error(`Error in EnabledVoiceListenerExperience: ${error}`);
			}
		};
	};
}

export { EnabledVoiceListenerExperience };
