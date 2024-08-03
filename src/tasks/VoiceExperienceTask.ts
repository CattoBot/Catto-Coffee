import { ScheduledTask, ScheduledTaskOptions } from '@sapphire/plugin-scheduled-tasks';
import { container } from '@sapphire/framework';
import { Time } from '@sapphire/time-utilities';
import { Guild, GuildMember, TextChannel, VoiceState } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { chunk } from 'lodash';

@ApplyOptions<ScheduledTaskOptions>({ interval: Time.Minute * 20, name: 'VoiceExperienceTask' })
export class VoiceExperienceTask extends ScheduledTask {
    public constructor(context: ScheduledTask.LoaderContext, options: ScheduledTask.Options) {
        super(context, {
            ...options,
        });
    }

    public async run(): Promise<void> {
        const failedKeys: string[] = [];

        try {
            const keys = await container.redis.keys('voiceSession:*');
            this.container.console.info(`Found ${keys.length} active voice sessions to process.`);

            const guilds: { [key: string]: string[] } = {};

            for (const key of keys) {
                const [, userId, guildId] = key.split(':');
                if (!guilds[guildId]) {
                    guilds[guildId] = [];
                }
                guilds[guildId].push(userId);
            }

            const guildChunks = chunk(Object.keys(guilds), 1000);
            for (const guildChunk of guildChunks) {
                const guildPromises = guildChunk.map(guildId => this.processGuildSessions(guildId, guilds[guildId], failedKeys));
                await Promise.all(guildPromises);
            }

            await this.addNewVoiceSessions();
        } catch (error) {
            this.container.console.error(`Error processing scheduled task for voice experience: ${error}`);
        }

        if (failedKeys.length > 0) {
            try {
                await container.redis.del(...failedKeys);
                this.container.console.info(`Cleaned up ${failedKeys.length} failed keys from Redis.`);
            } catch (error) {
                this.container.console.error(`Error cleaning up failed keys from Redis: ${error}`);
            }
        }
    }

    private async processGuildSessions(guildId: string, userIds: string[], failedKeys: string[]): Promise<void> {
        try {
            const guild = await this.container.client.guilds.fetch(guildId);
            this.container.console.info(`Starting to process sessions for guild: ${guild.name} (${guild.id}) with ${userIds.length} active sessions.`);

            for (const userId of userIds) {
                await this.processUserSession(userId, guild, failedKeys);
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        } catch (error) {
            this.container.console.error(`Error processing guild sessions for guild ID: ${guildId}: ${error}`);
            userIds.forEach(userId => failedKeys.push(`voiceSession:${userId}:${guildId}`));
        }
    }

    private async processUserSession(userId: string, guild: Guild, failedKeys: string[]): Promise<void> {
        const key = `voiceSession:${userId}:${guild.id}`;
        try {
            const sessionDataStr = await container.redis.get(key);
            if (sessionDataStr) {
                const sessionData = JSON.parse(sessionDataStr);
                const joinTime = sessionData.startTime;
                const now = Date.now();
                const durationInSeconds = (now - joinTime) / 1000;
                const member = await guild.members.fetch(userId);

                if (member) {
                    await this.processVoiceSession(member, guild, key, durationInSeconds);
                } else {
                    this.container.console.info(`No member found for user ID: ${userId} in guild ID: ${guild.id}`);
                    failedKeys.push(key);
                }
            } else {
                this.container.console.info(`No session data found for user ID: ${userId}`);
                failedKeys.push(key);
            }
        } catch (error) {
            this.container.console.error(`Error processing user session for user ID: ${userId} in guild ID: ${guild.id}: ${error}`);
            failedKeys.push(key);
        }
    }

    private async addNewVoiceSessions(): Promise<void> {
        this.container.console.info('Adding new voice sessions for all guilds.');
        const addSessionPromises = this.container.client.guilds.cache.map(async (guild) => {
            const voiceStates = guild.voiceStates.cache.filter((voiceState: VoiceState) => voiceState.channelId);
            const addSessionPromises = voiceStates.map(async (voiceState) => {
                if (voiceState.member?.user.bot) return;
                const userId = voiceState.id;
                const guildId = voiceState.guild.id;
                const key = `voiceSession:${userId}:${guildId}`;

                await container.redis.set(key, JSON.stringify({ startTime: Date.now() }));
            });
            await Promise.all(addSessionPromises);
        });
        await Promise.all(addSessionPromises);
        this.container.console.info('Finished adding new voice sessions.');
    }

    private async processVoiceSession(member: GuildMember, guild: Guild, sessionId: string, durationInSeconds: number): Promise<void> {
        try {
            let experience = await this.calculateExperience(durationInSeconds, guild);
            const bonusPercentage = await this.getUserBonusPercentage(member);
            if (bonusPercentage > 0) {
                experience += experience * (bonusPercentage / 100);
            }
            const updatedUser = await this.updateVoiceExperience(member, guild.id, experience, durationInSeconds);
            if (updatedUser.levelUp) {
                await this.handleLevelUp(member, guild.id, updatedUser.voiceLevel);
            }
            await container.redis.del(sessionId);
        } catch (error) {
            this.container.console.error(`Error processing voice session for member ${member.displayName}: ${error}`);
            await container.redis.del(sessionId);
        }
    }

    private async calculateExperience(durationInSeconds: number, guild: Guild): Promise<number> {
        const { min, max, cooldown } = await this.getMinMaxEXP(guild);
        const intervals = Math.floor(durationInSeconds / cooldown);
        return this.getRandomXP(min, max) * intervals;
    }

    private async getMinMaxEXP(guild: Guild): Promise<{ min: number; max: number; cooldown: number }> {
        const cacheKey = `voiceExpSettings:${guild.id}`;
        const cachedData = await this.container.redis.get(cacheKey);
        if (cachedData) {
            return JSON.parse(cachedData);
        }
        const voiceData = await this.container.prisma.i_voice_experience.findUnique({ where: { guildId: guild.id } });
        const expData = {
            cooldown: voiceData?.cooldown ?? Time.Minute,
            min: voiceData?.min ?? 5,
            max: voiceData?.max ?? 20
        };
        await this.container.redis.set(cacheKey, JSON.stringify(expData), 'EX', 3600);
        return expData;
    }

    private async updateVoiceExperience(member: GuildMember, guildID: string, experience: number, durationInSeconds: number): Promise<any> {
        try {
            const updatedUser = await this.updateUserExperience(member, guildID, experience, durationInSeconds);
            const { voiceLevel: currentLevel, voiceExperience: currentExperience } = updatedUser;
            const { levelUp, newLevel, newExperience } = await this.calculateLevelUp(member.user.id, guildID, currentExperience, currentLevel);

            return { ...updatedUser, voiceLevel: newLevel, voiceExperience: newExperience, levelUp: levelUp };
        } catch (error) {
            this.container.console.error(`Failed to update experience for user ${member.displayName}: ${error}`);
            throw error;
        }
    }

    private async updateUserExperience(member: GuildMember, guildID: string, experience: number, durationInSeconds: number): Promise<any> {
        const upsertUserExperience = async () =>
            await this.container.prisma.voice_experience.upsert({
                where: {
                    guildId_userId: {
                        guildId: guildID,
                        userId: member.user.id
                    }
                },
                create: {
                    userId: member.user.id,
                    guildId: guildID,
                    voiceExperience: experience,
                    totalVoiceExperience: experience,
                    totalTimeInVoiceChannel: durationInSeconds,
                    weeklyTimeInVoiceChannel: durationInSeconds,
                    dailyTimeInVoiceChannel: durationInSeconds,
                    monthlyTimeInVoiceChannel: durationInSeconds,
                },
                update: {
                    voiceExperience: { increment: experience },
                    totalVoiceExperience: { increment: experience },
                    totalTimeInVoiceChannel: { increment: durationInSeconds },
                    weeklyTimeInVoiceChannel: { increment: durationInSeconds },
                    dailyTimeInVoiceChannel: { increment: durationInSeconds },
                    monthlyTimeInVoiceChannel: { increment: durationInSeconds }
                }
            });

        await container.utils.retryAsync(upsertUserExperience, 3, 500);
        await this.updateGlobalExperience(member.user.id, durationInSeconds);
        const updatedUser = await this.container.prisma.voice_experience.findUnique({
            where: {
                guildId_userId: {
                    guildId: guildID,
                    userId: member.user.id
                }
            }
        });

        if (!updatedUser) {
            throw new Error('Failed to fetch updated user data.');
        }
        return updatedUser;
    }

    private async updateGlobalExperience(userId: string, duration: number) {
        const user = await this.container.prisma.users.findUnique({
            where: { userId },
            select: { globalExperience: true, globalLevel: true }
        });
        const experience = Math.random() * 350;
        let currentExperience = user?.globalExperience || 0;
        let currentLevel = user?.globalLevel || 1;
        let newExperience = currentExperience + experience;
        let nextLevelExperience = container.utils.xp.globalexperienceFormula(currentLevel + 1);
        while (newExperience >= nextLevelExperience) {
            newExperience -= nextLevelExperience;
            currentLevel++;
            nextLevelExperience = container.utils.xp.globalexperienceFormula(currentLevel + 1);
        }

        await this.container.prisma.users.upsert({
            where: { userId },
            update: { globalExperience: newExperience, globalLevel: currentLevel, totalGlobalExperience: { increment: experience }, totalTimeInVoiceChannel: { increment: duration } },
            create: { userId, globalExperience: newExperience, globalLevel: currentLevel, totalGlobalExperience: experience, totalTimeInVoiceChannel: duration }
        });
    }

    private async calculateLevelUp(userID: string, guildID: string, currentExperience: number, currentLevel: number): Promise<{ levelUp: boolean, newLevel: number, newExperience: number }> {
        let levelUp = false;
        let xpNeeded = container.utils.xp.experienceFormula(currentLevel);

        while (currentExperience >= xpNeeded) {
            currentLevel++;
            currentExperience -= xpNeeded;
            xpNeeded = container.utils.xp.experienceFormula(currentLevel);
            levelUp = true;
        }

        if (levelUp) {
            await this.container.prisma.voice_experience.update({
                where: {
                    guildId_userId: {
                        guildId: guildID,
                        userId: userID
                    }
                },
                data: {
                    voiceLevel: currentLevel,
                    voiceExperience: currentExperience
                }
            });
        }

        return { levelUp, newLevel: currentLevel, newExperience: currentExperience };
    }

    private async handleLevelUp(member: GuildMember, guildID: string, voiceLevel: number): Promise<void> {
        try {
            const message = await this.getNotificationMessage(guildID);
            const userMention = `<@${member.id}>`;
            const messageWithUserAndLevel = message.replace(/\{user}/g, userMention).replace(/\{level}/g, voiceLevel.toString());
            const channelID = await this.getNotificationChannelID(guildID);
            const notificationChannel = this.container.client.channels.resolve(channelID) as TextChannel;
            if (notificationChannel) {
                await notificationChannel.send(messageWithUserAndLevel);
            }

            await this.assignRoles(member, guildID, voiceLevel);
        } catch (error) {
            this.container.console.error(`Failed to handle level up for user ${member.displayName}: ${error}`);
        }
    }

    private async assignRoles(member: GuildMember, guildID: string, voiceLevel: number): Promise<void> {
        const rolesForLevel = await this.container.prisma.experience_role_rewards.findMany({
            where: {
                guildId: guildID,
                level: { lte: voiceLevel },
                roleType: "voice"
            }
        });

        const roleIdsForLevel = new Set(rolesForLevel.map(role => role.roleId));
        const currentRoleIds = new Set(member.roles.cache.keys());
        const rolesToAssign = Array.from(member.guild.roles.cache.values()).filter(role => roleIdsForLevel.has(role.id) && !currentRoleIds.has(role.id));
        if (rolesToAssign.length > 0) {
            await member.roles.add(rolesToAssign).catch(() => null);
        }
    }

    private async getNotificationMessage(guildID: string): Promise<string> {
        try {
            const guildData = await this.container.prisma.i_voice_experience.findUnique({ where: { guildId: guildID } });
            return guildData?.lvlUpMsg ?? "Congratulations, {user}! You've just reached level {level} in voice channels!";
        } catch (error) {
            this.container.console.error(`Error fetching level up message for guild ${guildID}: ${error}`);
            return "Congratulations, {user}! You've just reached level {level} in voice channels! uwu";
        }
    }

    private async getNotificationChannelID(guildID: string): Promise<string> {
        try {
            const guildData = await this.container.prisma.i_voice_experience.findUnique({ where: { guildId: guildID } });
            return guildData?.msgChannelId ?? "";
        } catch (error) {
            this.container.console.error(`Error fetching notification channel ID for guild ${guildID}: ${error}`);
            return "";
        }
    }

    private getRandomXP(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    private async getUserBonusPercentage(member: GuildMember): Promise<number> {
        const bonusRoles = await this.container.prisma.bonus_voice_roles.findMany({ where: { guildId: member.guild.id } });
        const userRoles = member.roles.cache;
        let maxBonus = 0;
        for (const role of bonusRoles) {
            if (userRoles.has(role.roleId)) {
                if (role.bonus! > maxBonus) {
                    maxBonus = role.bonus!;
                }
            }
        }

        return maxBonus;
    }
}
