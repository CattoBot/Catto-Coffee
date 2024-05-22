import { container } from "@sapphire/framework";
import { VoiceState } from "discord.js";

export function FilteredVoiceChannel() {
    return function (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: [VoiceState, VoiceState]) {
            const [_oldState, newState] = args;

            if (!newState.channel) {
                return originalMethod.apply(this, args);
            }

            const channelId = newState.channel.id;
            const guildId = newState.guild.id;
            const redisKey = `filteredVoiceChannel:${guildId}:${channelId}`;
            const redisResult = await container.redis.get(redisKey);
            if (redisResult) {
                container.console.info(`Channel ${channelId} is filtered (cached). No voice session will be added for guild ${guildId}.`);
                return;
            }

            const isFilteredChannel = await container.prisma.filteredVoiceChannels.findUnique({
                where: {
                    guildId_channelId: {
                        guildId: guildId,
                        channelId: channelId
                    }
                }
            });

            if (isFilteredChannel) {
                await container.redis.set(redisKey, 'true');
                container.console.info(`Channel ${channelId} is filtered. No voice session will be added for guild ${guildId}.`);
                return;
            }

            return originalMethod.apply(this, args);
        };
    };
}
