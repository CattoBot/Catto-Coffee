import { container } from "@sapphire/framework";
import { Message } from "discord.js";

export function FilteredTextChannel() {
    return function (_target: Object, _propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: [Message]) {
            try {
                const [message] = args;

                if (!message.guild || !message.channel) {
                    return originalMethod.apply(this, args);
                }

                const channelId = message.channel.id;
                const guildId = message.guild.id;
                const redisKey = `filteredTextChannel:${guildId}:${channelId}`;
                const redisResult = await container.redis.get(redisKey);
                if (redisResult) {
                    container.console.info(`Channel ${channelId} is filtered (cached). No text experience will be added for guild ${guildId}.`);
                    return;
                }

                const isFilteredChannel = await container.prisma.filtered_text_channels.findUnique({
                    where: {
                        guildId_channelId: {
                            guildId: guildId,
                            channelId: channelId
                        }
                    }
                });

                if (isFilteredChannel) {
                    await container.redis.set(redisKey, 'true');
                    container.console.info(`Channel ${channelId} is filtered. No text experience will be added for guild ${guildId}.`);
                    return;
                }

                return originalMethod.apply(this, args);
            } catch (error) {
                container.logger.error(`Error in FilteredTextChannel: ${error}`);
            }
        };
    };
}
