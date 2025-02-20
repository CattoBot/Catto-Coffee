// checkExperienceEnabled.ts
import { container } from '@sapphire/framework';
import type { Message } from 'discord.js';
import type { PrismaClient } from '@prisma/client';
import type { Redis } from 'ioredis';

interface MessageHandler {
	(message: Message): Promise<void>;
}

// function EnabledTextListenerExperience(
//   _target: Object,
//   _propertyKey: string,
//   descriptor: PropertyDescriptor
// ): void {
//   const originalMethod: MessageHandler = descriptor.value;
//   const prisma: PrismaClient = container.prisma;
//   const redis: Redis = container.redis;

//   descriptor.value = async function (message: Message): Promise<void> {
//     if (!message.guild || message.member?.user.bot) return;

//     const guildId = message.guild.id;
//     const cacheKey = `guild:${guildId}:textXPEnabled`;
//     const cachedEnabled = await redis.get(cacheKey);

//     let isEnabled: boolean;

//     if (cachedEnabled !== null) {
//       isEnabled = JSON.parse(cachedEnabled);
//     } else {
//       const result = await prisma.i_text_experience.findUnique({ where: { guildId } });
//       isEnabled = result?.isEnabled ?? false;
//       await redis.set(cacheKey, JSON.stringify(isEnabled), 'EX', 3600); // Cache for 1 hour
//     }

//     if (isEnabled) {
//       return originalMethod.call(this, message);
//     } else {
//       return;
//     }
//   };
// }

function EnabledTextListenerExperience() {
	return function (_target: Object, _propertyKey: string, descriptor: PropertyDescriptor) {
		const originalMethod: MessageHandler = descriptor.value;
		const prisma: PrismaClient = container.prisma;
		const redis: Redis = container.redis;

		descriptor.value = async function (message: Message): Promise<void> {
			if (!message.guild || message.member?.user.bot) return;

			const guildId = message.guild.id;
			const cacheKey = `guild:${guildId}:textXPEnabled`;
			const cachedEnabled = await redis.get(cacheKey);

			let isEnabled: boolean;

			if (cachedEnabled !== null) {
				isEnabled = JSON.parse(cachedEnabled);
			} else {
				const result = await prisma.i_text_experience.findUnique({ where: { guildId } });
				isEnabled = result?.isEnabled ?? false;
				await redis.set(cacheKey, JSON.stringify(isEnabled), 'EX', 3600); // Cache for 1 hour
			}

			if (isEnabled) {
				return originalMethod.call(this, message);
			} else {
				return;
			}
		};
	};
}

export { EnabledTextListenerExperience };
