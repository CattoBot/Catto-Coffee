import { ScheduledTask, ScheduledTaskOptions } from '@sapphire/plugin-scheduled-tasks';
import { container } from '@sapphire/framework';
import { Time } from '@sapphire/time-utilities';
import { Guild, GuildMember } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';

@ApplyOptions<ScheduledTaskOptions>({ interval: Time.Minute * 10, name: 'VoiceExperienceTask' })
export class VoiceExperienceTask extends ScheduledTask {
    public constructor(context: ScheduledTask.LoaderContext, options: ScheduledTask.Options) {
        super(context, { ...options });
    }

    public async run(): Promise<void> {
        const failedKeys: string[] = [];

        try {
            const keys = await container.redis.keys('voiceSession:*');
            this.container.console.info(`Found ${keys.length} active voice sessions to process.`);

            const guilds: { [key: string]: string[] } = {};
            keys.forEach(key => {
                const [, userId, guildId] = key.split(':');
                if (!guilds[guildId]) guilds[guildId] = [];
                guilds[guildId].push(userId);
            });

            this.container.console.info(`Processing ${Object.keys(guilds).length} guilds in parallel.`);
            const guildPromises = Object.keys(guilds).map(guildId =>
                this.processGuildSessions(guildId, guilds[guildId], failedKeys)
            );
            await Promise.all(guildPromises);

            await this.addNewVoiceSessions();
        } catch (error) {
            this.container.console.error(`Error processing scheduled task: ${error}`);
        }

        if (failedKeys.length > 0) {
            await container.redis.del(...failedKeys);
            this.container.console.info(`Cleaned up ${failedKeys.length} failed keys from Redis.`);
        }
    }

    private async processGuildSessions(guildId: string, userIds: string[], failedKeys: string[]): Promise<void> {
        try {
            const guild = await this.container.client.guilds.fetch(guildId);
            const userPromises: any[] = [];
            userIds.forEach(userId => {
                userPromises.push(this.processUserSession(userId, guild, failedKeys));
            });
            await Promise.all(userPromises);
        } catch (error) {
            this.container.console.error(`Error processing guild ID ${guildId}: ${error}`);
        }
    }

    private async processUserSession(userId: string, guild: Guild, failedKeys: string[]): Promise<void> {
        const key = `voiceSession:${userId}:${guild.id}`;
        try {
            const sessionDataStr = await container.redis.get(key);
            if (sessionDataStr) {
                const sessionData = JSON.parse(sessionDataStr);
                const durationInSeconds = (Date.now() - sessionData.startTime) / 1000;
                const member = await guild.members.fetch(userId).catch(() => null);

                if (member) {
                    await this.processVoiceSession(member, guild, key, durationInSeconds);
                } else {
                    failedKeys.push(key);
                }
            } else {
                failedKeys.push(key);
            }
        } catch (error) {
            failedKeys.push(key);
        }
    }

    private async processVoiceSession(member: GuildMember, guild: Guild, sessionId: string, durationInSeconds: number): Promise<void> {
        try {
            const experience = await this.calculateExperience(durationInSeconds, guild);
            const updatedUser = await this.updateVoiceExperience(member, guild.id, experience, durationInSeconds);

            const key = `voiceLeaderboard:${guild.id}`;
            await container.redis.zadd(key, updatedUser.totalVoiceExperience, member.user.id);

            await container.redis.del(sessionId);
        } catch (error) {
            await container.redis.del(sessionId);
        }
    }

    private async addNewVoiceSessions(): Promise<void> {
        const guildPromises = this.container.client.guilds.cache.map(async guild => {
            const voiceStates = guild.voiceStates.cache.filter(vs => vs.channelId);
            const sessionPromises = voiceStates.map(async voiceState => {
                if (!voiceState.member?.user.bot) {
                    const key = `voiceSession:${voiceState.id}:${voiceState.guild.id}`;
                    await container.redis.set(key, JSON.stringify({ startTime: Date.now() }));
                }
            });
            await Promise.all(sessionPromises);
        });
        await Promise.all(guildPromises);
    }

    private async calculateExperience(durationInSeconds: number, guild: Guild): Promise<number> {
        const { min, max, cooldown } = await this.getMinMaxEXP(guild);
        const intervals = Math.floor(durationInSeconds / cooldown);
        return Math.floor(Math.random() * (max - min + 1) + min) * intervals;
    }

    private async getMinMaxEXP(guild: Guild): Promise<{ min: number; max: number; cooldown: number }> {
        const cacheKey = `voiceExpSettings:${guild.id}`;
        const cached = await container.redis.get(cacheKey);
        if (cached) return JSON.parse(cached);

        const data = await this.container.prisma.i_voice_experience.findUnique({ where: { guildId: guild.id } });
        const result = {
            min: data?.min || 5,
            max: data?.max || 20,
            cooldown: data?.cooldown || Time.Minute,
        };
        await container.redis.set(cacheKey, JSON.stringify(result), 'EX', 3600);
        return result;
    }

    private async updateVoiceExperience(member: GuildMember, guildId: string, experience: number, duration: number) {
        const updatedUser = await this.container.prisma.voice_experience.upsert({
            where: { guildId_userId: { guildId, userId: member.user.id } },
            update: { voiceExperience: { increment: experience } },
            create: {
                userId: member.user.id,
                guildId,
                voiceExperience: experience,
                totalVoiceExperience: experience,
                totalTimeInVoiceChannel: duration,
            },
        });
        return updatedUser;
    }
}
