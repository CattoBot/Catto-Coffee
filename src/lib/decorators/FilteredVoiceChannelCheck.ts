import { VoiceChannel } from 'discord.js';
import { container } from '@sapphire/pieces';

export function FilteredVoiceChannels() {
    return function (_target: Object, _propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: Object[]) {
            const guilds = container.client.guilds.cache.values();

            for (const guild of guilds) {
                for (const channel of guild.channels.cache.values()) {
                    if (channel instanceof VoiceChannel) {
                        const filteredChannel = await container.prisma.filtered_voice_channels.findUnique({
                            where: {
                                guildId_channelId: {
                                    guildId: guild.id,
                                    channelId: channel.id,
                                },
                            },
                        });
                        if (filteredChannel) {
                            const redisKey = `filteredVoiceChannel:${guild.id}:${channel.id}`;
                            await container.redis.set(redisKey, JSON.stringify({
                                guildId: guild.id,
                                channelId: channel.id,
                            }));
                        }
                    }
                }
            }

            await originalMethod.apply(this, args);
        };

        return descriptor;
    };
}
