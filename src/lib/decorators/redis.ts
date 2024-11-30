import { container } from '@sapphire/framework';

export function SyncRankings() {
    return function (_target: any, _propertyKey: string, descriptor: PropertyDescriptor): void {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            container.console.info('Starting leaderboard sync...');

            try {
                const guilds = await container.prisma.guilds.findMany();
                for (const guild of guilds) {
                    await syncVoiceLeaderboard(guild.guildId);
                    await syncTextLeaderboard(guild.guildId);
                }
                await syncGlobalLeaderboard();
            } catch (error) {
                container.console.error('Error syncing leaderboards:', error);
            }

            container.console.info('Leaderboard sync complete.');
            return originalMethod.apply(this, args);
        };

        async function syncVoiceLeaderboard(guildId: string): Promise<void> {
            const voiceUsers = await container.prisma.voice_experience.findMany({
                where: { guildId },
                select: { userId: true, totalVoiceExperience: true },
            });

            const voiceKey = `voiceLeaderboard:${guildId}`;
            const pipeline = container.redis.pipeline();
            for (const user of voiceUsers) {
                pipeline.zadd(voiceKey, user.totalVoiceExperience, user.userId);
            }
            await pipeline.exec();

            container.console.info(`Synced ${voiceKey} with ${voiceUsers.length} entries.`);
        }

        async function syncTextLeaderboard(guildId: string): Promise<void> {
            const textUsers = await container.prisma.text_experience.findMany({
                where: { guildId },
                select: { userId: true, totalTextExperience: true },
            });

            const textKey = `textLeaderboard:${guildId}`;
            const pipeline = container.redis.pipeline();
            for (const user of textUsers) {
                pipeline.zadd(textKey, user.totalTextExperience, user.userId);
            }
            await pipeline.exec();

            container.console.info(`Synced ${textKey} with ${textUsers.length} entries.`);
        }

        async function syncGlobalLeaderboard(): Promise<void> {
            const globalUsers = await container.prisma.users.findMany({
                select: { userId: true, totalGlobalExperience: true },
            });

            const globalKey = 'generalLeaderboard';
            const pipeline = container.redis.pipeline();
            for (const user of globalUsers) {
                pipeline.zadd(globalKey, user.totalGlobalExperience, user.userId);
            }
            await pipeline.exec();

            container.console.info(`Synced ${globalKey} with ${globalUsers.length} entries.`);
        }
    };
}
