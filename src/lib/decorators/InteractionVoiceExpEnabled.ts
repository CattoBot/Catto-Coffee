// checkExperienceEnabled.ts
import { container } from '@sapphire/framework';
import type { ButtonInteraction } from 'discord.js';
import type { PrismaClient } from '@prisma/client';
import type { Redis } from 'ioredis';

interface InteractionHandler {
	(interaction: ButtonInteraction): Promise<void>;
}

function CheckVoiceExperienceEnabled(_target: Object, _propertyKey: string, descriptor: PropertyDescriptor): void {
	const originalMethod: InteractionHandler = descriptor.value;
	const prisma: PrismaClient = container.prisma;
	const redis: Redis = container.redis;

	descriptor.value = async function (interaction: ButtonInteraction): Promise<void> {
		const guildId = interaction.guildId!;
		if (!interaction.guild || interaction.user.bot) return;
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
			return originalMethod.call(this, interaction);
		} else {
			await interaction.reply({ content: 'Voice experience is not enabled in this server.', ephemeral: true });
			return;
		}
	};
}

export { CheckVoiceExperienceEnabled };
