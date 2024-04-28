import { Guild, GuildMember, TextChannel, VoiceState } from "discord.js";
import { Listener, Events } from "@sapphire/framework";
import { Time } from "@sapphire/time-utilities";
import { Prisma, PrismaCoreModule } from "@lib/database/prisma";
import { ApplyOptions } from "@sapphire/decorators";
import { XPCalculator } from "@utils/xp-calculator";
import { Redis, RedisCoreModule } from "@lib/database/redis";
import { logger, ServerLogger } from "@lib/helpers/misc/logger.helper";
import { retryAsync } from "@utils/retryasync";

@ApplyOptions<Listener.Options>({ event: Events.VoiceStateUpdate, once: false })
export class VoiceLevelingCoreModule extends Listener {
    private prisma: PrismaCoreModule;
    private redisClient: RedisCoreModule;
    private logger: ServerLogger
    constructor(context: Listener.LoaderContext, options: Listener.Options) {
        super(context, {
            ...options
        });
        this.prisma = Prisma;
        this.redisClient = Redis;
        this.logger = logger;
    }

    public async run(oldState: VoiceState, newState: VoiceState): Promise<void> {
        if (newState.member?.user.bot) return;

        const sessionId = `voiceSession:${newState.member.id}`;
        try {
            if (newState.channel && !oldState.channel) {
                await this.handleChannelJoin(newState, sessionId);
            } else if (!newState.channel && oldState.channel) {
                await this.handleChannelLeave(oldState, sessionId);
            } else if (newState.channel && oldState.channel && newState.channel.id !== oldState.channel.id) {
                await this.handleChannelSwitch(oldState, newState, sessionId);
            }
        } catch (error) {
            this.logger.error(`Error processing voice state update: ${error}`);
        }
    }

    private async processVoiceSession(member: GuildMember, sessionId: string, oldChannelId: string, newChannelId?: string): Promise<void> {
        try {
            const sessionData = await this.loadSessionData(sessionId);
            if (!sessionData) return;

            const joinTime = sessionData.startTime;
            const leaveTime = Date.now();
            const durationInSeconds = (leaveTime - joinTime) / 1000;
            const experience = await this.calculateExperience(durationInSeconds, member.guild);
            this.logger.info(`[${member.displayName}] spent ${durationInSeconds.toFixed(2)} seconds in channel ID [${oldChannelId}] and earned ${experience} XP`);

            const updatedUser = await this.updateVoiceExperience(member, member.guild.id, experience, durationInSeconds);
            if (updatedUser.levelUp) {
                await this.handleLevelUp(member, member.guild.id, updatedUser.voiceLevel);
            }

            if (newChannelId) {
                await this.updateRedisOnChannelSwitch(sessionId, leaveTime);
            } else {
                await this.updateRedisOnChannelLeave(sessionId);
            }
        } catch (error) {
            this.logger.error(`Error processing voice session for member ${member.displayName}: ${error}`);
        }
    }


    private async getMinMaxEXP(guild: Guild): Promise<{ min: number; max: number, cooldown: number }> {
        const guildID = guild.id;
        const redisKey = `voiceXP:${guildID}`;
        let cachedDataStr = await this.redisClient.get(redisKey);
        if (cachedDataStr) {
            const cachedData = JSON.parse(cachedDataStr) as { cooldown: number, min: number, max: number };
            return {
                cooldown: cachedData.cooldown,
                min: cachedData.min,
                max: cachedData.max
            };
        }

        const voiceData = await this.prisma.iVoiceXP.findUnique({ where: { guildId: guildID } });
        const expData = {
            cooldown: voiceData.cooldown ?? Time.Minute * 1,
            min: voiceData.min ?? 5,
            max: voiceData.max ?? 20
        };
        await this.redisClient.set(redisKey, JSON.stringify(expData), 'EX', Time.Hour * 24);
        return expData;
    }


    private async updateVoiceExperience(member: GuildMember, guildID: string, experience: number, durationInSeconds: number): Promise<any> {
        try {
            const updatedUser = await this.updateUserExperience(member, guildID, experience, durationInSeconds);
            const { voiceLevel: currentLevel, voiceExperience: currentExperience } = updatedUser;
            const { levelUp, newLevel, newExperience } = await this.calculateLevelUp(member.user.id, guildID, currentExperience, currentLevel);

            return { ...updatedUser, voiceLevel: newLevel, voiceExperience: newExperience, levelUp: levelUp };
        } catch (error) {
            this.logger.error(`Failed to update experience for user ${member.displayName}: ${error}`);
            throw error;
        }
    }

    private async updateUserExperience(member: GuildMember, guildID: string, experience: number, durationInSeconds: number): Promise<any> {
        const upsertUserExperience = async () => await this.prisma.vocieExperience.upsert({
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
                totalTimeInVoiceChannel: durationInSeconds
            },
            update: {
                voiceExperience: { increment: experience },
                totalVoiceExperience: { increment: experience },
                totalTimeInVoiceChannel: { increment: durationInSeconds }
            },
        });
        return retryAsync(upsertUserExperience, 3, 500);
    }

    private async calculateLevelUp(userID: string, guildID: string, currentExperience: number, currentLevel: number): Promise<{ levelUp: boolean, newLevel: number, newExperience: number }> {
        let levelUp = false;
        let xpNeeded = XPCalculator(currentLevel);

        while (currentExperience >= xpNeeded) {
            currentLevel++;
            currentExperience -= xpNeeded;
            xpNeeded = XPCalculator(currentLevel);
            levelUp = true;
        }

        if (levelUp) {
            await this.prisma.vocieExperience.update({
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
            const messageWithUserAndLevel = message.replace(/\{user\}/g, userMention).replace(/\{level\}/g, voiceLevel.toString());

            const channelID = await this.getNotificationChannelID(guildID);
            const notificationChannel = this.container.client.channels.resolve(channelID) as TextChannel;
            if (notificationChannel) {
                await notificationChannel.send(messageWithUserAndLevel);
            }

            await this.assignRoles(member, guildID, voiceLevel);
        } catch (error) {
            this.logger.error(`Failed to handle level up for user ${member.displayName}: ${error}`);
        }
    }

    private async assignRoles(member: GuildMember, guildID: string, voiceLevel: number): Promise<void> {

        const rolesForLevel = await this.prisma.roleRewards.findMany({
            where: {
                guildId: guildID,
                level: { lte: voiceLevel },
                roleType: "Voice"
            }
        });

        const roleIdsForLevel = new Set(rolesForLevel.map(role => role.roleId));
        const currentRoleIds = new Set(member.roles.cache.keys());
        const rolesToAssign = Array.from(member.guild.roles.cache.values()).filter(role => roleIdsForLevel.has(role.id) && !currentRoleIds.has(role.id));
        if (rolesToAssign.length > 0) {
            await member.roles.add(rolesToAssign).catch(e => {
                this.logger.error(`Failed to batch assign roles to ${member.displayName}: ${e}`);
            });
            this.logger.info(`Assigned ${rolesToAssign.length} new roles to ${member.displayName} for reaching level ${voiceLevel}.`);
        }
    }

    private async getNotificationMessage(guildID: string): Promise<string> {
        try {
            const guildData = await this.prisma.iVoiceXP.findUnique({ where: { guildId: guildID } });
            return guildData?.lvlUpMsg ?? "Congratulations, {user}! You've just reached level {level} in voice channels!";
        } catch (error) {
            this.logger.error(`Error fetching level up message for guild ${guildID}: ${error}`);
            return "Congratulations, {user}! You've just reached level {level} in voice channels!";
        }
    }

    private async getNotificationChannelID(guildID: string): Promise<string> {
        try {
            const guildData = await this.prisma.iVoiceXP.findUnique({ where: { guildId: guildID } });
            return guildData?.msgChannelId;
        } catch (error) {
            this.logger.error(`Error fetching notification channel ID for guild ${guildID}: ${error}`);
            return;
        }
    }

    private async loadSessionData(sessionId: string): Promise<{ startTime: number } | null> {
        const getSessionData = async () => {
            const sessionDataStr = await this.redisClient.get(sessionId);
            return sessionDataStr ? JSON.parse(sessionDataStr) : null;
        };
        return retryAsync(getSessionData, 3, 200);
    }

    private async calculateExperience(durationInSeconds: number, guild: Guild): Promise<number> {
        const { min, max, cooldown } = await this.getMinMaxEXP(guild);
        const intervals = Math.floor(durationInSeconds / cooldown);
        return this.getRandomXP(min, max) * intervals;
    }

    private async updateRedisOnChannelLeave(sessionId: string): Promise<void> {
        const deleteSession = async () => await this.redisClient.del(sessionId);
        await retryAsync(deleteSession, 3, 200);
    }

    private async updateRedisOnChannelSwitch(sessionId: string, leaveTime: number): Promise<void> {
        const updateSession = async () => await this.redisClient.set(sessionId, JSON.stringify({ startTime: leaveTime }));
        await retryAsync(updateSession, 3, 200);
    }

    private async handleChannelJoin(newState: VoiceState, sessionId: string): Promise<void> {
        this.logger.info(`[${newState.member.displayName}] has joined voice channel ID [${newState.channel.id}]`);
        const guild = await this.prisma.iVoiceXP.findUnique({ where: { guildId: newState.guild.id } });
        if (!guild) {
            await this.prisma.iVoiceXP.create({ data: { guildId: newState.guild.id } });
        }
        await this.redisClient.set(sessionId, JSON.stringify({ startTime: Date.now() }));
    }

    private async handleChannelLeave(oldState: VoiceState, sessionId: string): Promise<void> {
        this.logger.info(`[${oldState.member.displayName}] has left voice channel ID [${oldState.channel.id}]`);
        await this.processVoiceSession(oldState.member, sessionId, oldState.channel.id);
    }

    private async handleChannelSwitch(oldState: VoiceState, newState: VoiceState, sessionId: string): Promise<void> {
        this.logger.info(`[${oldState.member.displayName}] switched from voice channel ID [${oldState.channel.id}] to [${newState.channel.id}]`);
        await this.processVoiceSession(oldState.member, sessionId, oldState.channel.id, newState.channel.id);
    }

    private getRandomXP(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}