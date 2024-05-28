import { container } from '@sapphire/framework';

export function SaveActiveVoiceSessions() {
    return function (
        _target: any,
        _propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            container.console.info('Saving active voice sessions...');

            for (const guild of container.client.guilds.cache.values()) {
                for (const channel of guild.channels.cache.values()) {
                    if (channel.isVoiceBased()) {
                        for (const [memberId, member] of channel.members) {
                            if (!member.user.bot) {
                                const sessionId = `voiceSession:${memberId}:${guild.id}`;
                                const sessionData = await container.redis.get(sessionId);
                                if (sessionData) {
                                    const { startTime } = JSON.parse(sessionData);
                                    const durationInSeconds = (Date.now() - startTime) / 1000;

                                    await container.prisma.voice_experience.upsert({
                                        where: {
                                            guildId_userId: {
                                                guildId: guild.id,
                                                userId: member.user.id
                                            }
                                        },
                                        create: {
                                            userId: member.user.id,
                                            guildId: guild.id,
                                            voiceExperience: 0,
                                            totalVoiceExperience: 0,
                                            totalTimeInVoiceChannel: durationInSeconds,
                                            weeklyTimeInVoiceChannel: durationInSeconds,
                                            dailyTimeInVoiceChannel: durationInSeconds,
                                            monthlyTimeInVoiceChannel: durationInSeconds,
                                        },
                                        update: {
                                            totalTimeInVoiceChannel: { increment: durationInSeconds },
                                            weeklyTimeInVoiceChannel: { increment: durationInSeconds },
                                            dailyTimeInVoiceChannel: { increment: durationInSeconds },
                                            monthlyTimeInVoiceChannel: { increment: durationInSeconds }
                                        }
                                    });

                                    container.console.info(`Saved session for ${member.displayName} in ${guild.name}`);
                                }
                            }
                        }
                    }
                }
            }

            return originalMethod.apply(this, args);
        };

        return descriptor;
    };
}
