import { container } from "@sapphire/pieces";
import type { ButtonInteraction } from 'discord.js';
import { formatTime } from "../utils";

function ButtonCooldown(cooldownTime: number) {
    return function (_target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: [ButtonInteraction]) {
            const interaction = args[0];
            const userId = interaction.user.id;
            const commandName = propertyKey;
            const cooldownKey = getCooldownKey(userId, commandName);

            const currentCooldown = await container.redis.get(cooldownKey);

            if (currentCooldown) {
                await interaction.reply({ content: `Please wait \`${formatTime(cooldownTime)}\` before using this button again.`, ephemeral: true });
                return;
            }

            await container.redis.set(cooldownKey, '1', 'EX', cooldownTime);
            return originalMethod.apply(this, args);
        };

        return descriptor;
    };
}

function getCooldownKey(userId: string, commandName: string): string {
    return `cooldown:${userId}:${commandName}`;
}

export { ButtonCooldown };
