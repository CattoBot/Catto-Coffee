import { ApplyOptions } from "@sapphire/decorators";
import { container } from "@sapphire/framework";
import { Events, Listener } from "@sapphire/framework";
import { Time } from "@sapphire/time-utilities";
import { Guild, GuildMember, TextChannel, VoiceState } from "discord.js";
import { EnabledVoiceListenerExperience } from "../../lib/decorators/ListenerVoiceExpEnabled";
import { FilteredVoiceChannel } from "../../lib/decorators/ListenerVoiceExperienceFilteredChannel";
import { VoiceUserEntry } from "../../lib/decorators/DatabaseVoiceUserEntry";

@ApplyOptions<Listener.Options>({ event: Events.VoiceStateUpdate, once: false })
export class VoiceLevelingCoreModule extends Listener<typeof Events.VoiceStateUpdate> {
  constructor(context: Listener.LoaderContext, options: Listener.Options) {
    super(context, {
      ...options
    });
  }

  @EnabledVoiceListenerExperience()
  @FilteredVoiceChannel()
  @VoiceUserEntry()
  public async run(oldState: VoiceState, newState: VoiceState): Promise<void> {
    if (!newState.member || newState.member.user.bot) {
      this.container.console.warn("No se encontró miembro en el nuevo estado de voz o es un bot.");
      return;
    }

    const sessionId = `voiceSession:${newState.member.id}:${newState.guild.id}`;

    try {
      if (newState.channel && !oldState.channel) {
        await this.handleChannelJoin(newState, sessionId);
      } else if (!newState.channel && oldState.channel) {
        await this.handleChannelLeave(oldState, sessionId);
      } else if (newState.channel && oldState.channel && newState.channel.id !== oldState.channel.id) {
        await this.handleChannelSwitch(oldState, newState, sessionId);
      }
    } catch (error) {
      this.container.console.error(`Error processing voice state update: ${error}`);
    }
  }

  private async processVoiceSession(member: GuildMember, sessionId: string, _oldChannelId: string, newChannelId?: string): Promise<void> {
    try {
      const sessionData = await this.loadSessionData(sessionId);
      if (!sessionData) return;
      const joinTime = sessionData.startTime;
      const leaveTime = Date.now();
      const durationInSeconds = (leaveTime - joinTime) / 1000;
      let experience = await this.calculateExperience(durationInSeconds, member.guild);
      const bonusPercentage = await this.getUserBonusPercentage(member);
      if (bonusPercentage > 0) {
        experience += experience * (bonusPercentage / 100);
      }
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
      this.container.console.error(`Error processing voice session for member ${member.displayName}: ${error}`);
      await this.container.redis.del(sessionId);
    }
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
      if (!updatedUser) {
        throw new Error('User update failed.');
      }
      const { voiceLevel: currentLevel, voiceExperience: currentExperience } = updatedUser;
      const { levelUp, newLevel, newExperience } = await this.calculateLevelUp(member.user.id, guildID, currentExperience, currentLevel);
      return { ...updatedUser, voiceLevel: newLevel, voiceExperience: newExperience, levelUp: levelUp };
    } catch (error) {
      this.container.console.error(`Failed to update experience for user ${member.displayName}: ${error}`);
      throw error;
    }
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
    let nextLevelExperience = container.helpers.leveling.xp.globalExperienceFormula(currentLevel + 1);
    while (newExperience >= nextLevelExperience) {
      newExperience -= nextLevelExperience;
      currentLevel++;
      nextLevelExperience = container.helpers.leveling.xp.globalExperienceFormula(currentLevel + 1);
    }

    await this.container.prisma.users.upsert({
      where: { userId },
      update: { globalExperience: newExperience, globalLevel: currentLevel, totalGlobalExperience: { increment: experience }, totalTimeInVoiceChannel: { increment: duration } },
      create: { userId, globalExperience: newExperience, globalLevel: currentLevel, totalGlobalExperience: experience, totalTimeInVoiceChannel: duration }
    });
  }

  private async updateUserExperience(member: GuildMember, guildID: string, experience: number, durationInSeconds: number): Promise<any> {
    const upsertUserExperience = async () => await this.container.prisma.voice_experience.upsert({
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
        totalTimeInVoiceChannel: { increment: durationInSeconds },
        weeklyTimeInVoiceChannel: { increment: durationInSeconds },
        dailyTimeInVoiceChannel: { increment: durationInSeconds },
        monthlyTimeInVoiceChannel: { increment: durationInSeconds },
        totalVoiceExperience: { increment: experience }
      },
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

  private async calculateLevelUp(userID: string, guildID: string, currentExperience: number, currentLevel: number): Promise<{ levelUp: boolean, newLevel: number, newExperience: number }> {
    let levelUp = false;
    let xpNeeded = container.helpers.leveling.xp.experienceFormula(currentLevel);

    while (currentExperience >= xpNeeded) {
      currentLevel++;
      currentExperience -= xpNeeded;
      xpNeeded = container.helpers.leveling.xp.experienceFormula(currentLevel);
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
      const messageWithUserAndLevel = message.replace(/\{user}/g, `<@${member.id}>`).replace(/\{level}/g, voiceLevel.toString());
      const channelID = await this.getNotificationChannelID(guildID);
      if (channelID && await this.doesChannelExist(member.guild, channelID)) {
        const notificationChannel = this.container.client.channels.resolve(channelID) as TextChannel;
        if (notificationChannel) {
          await notificationChannel.send(messageWithUserAndLevel);
        }
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

  private async loadSessionData(sessionId: string): Promise<{ startTime: number } | null> {
    const getSessionData = async () => {
      const sessionDataStr = await this.container.redis.get(sessionId);
      return sessionDataStr ? JSON.parse(sessionDataStr) : null;
    };
    return container.utils.retryAsync(getSessionData, 3, 200);
  }

  private async calculateExperience(durationInSeconds: number, guild: Guild): Promise<number> {
    const { min, max, cooldown } = await this.getMinMaxEXP(guild);
    const intervals = Math.floor(durationInSeconds / cooldown);
    return this.getRandomXP(min, max) * intervals;
  }

  private async updateRedisOnChannelLeave(sessionId: string): Promise<void> {
    const deleteSession = async () => await this.container.redis.del(sessionId);
    await container.utils.retryAsync(deleteSession, 3, 200);
  }

  private async updateRedisOnChannelSwitch(sessionId: string, leaveTime: number): Promise<void> {
    const updateSession = async () => await this.container.redis.set(sessionId, JSON.stringify({ startTime: leaveTime }));
    await container.utils.retryAsync(updateSession, 3, 200);
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

  private async handleChannelJoin(newState: VoiceState, sessionId: string): Promise<void> {
    const guild = await this.container.prisma.i_voice_experience.findUnique({ where: { guildId: newState.guild.id } });
    if (!guild) {
      await this.container.prisma.i_voice_experience.create({ data: { guildId: newState.guild.id } });
    }
    await this.container.redis.set(sessionId, JSON.stringify({ startTime: Date.now() }));
  }

  private async handleChannelLeave(oldState: VoiceState, sessionId: string): Promise<void> {
    if (!oldState.member) {
      this.container.console.warn("El estado de voz anterior no tiene miembro.");
      return;
    }

    if (!oldState.channel) {
      this.container.console.warn("El estado de voz anterior no tiene canal.");
      return;
    }

    await this.processVoiceSession(oldState.member, sessionId, oldState.channel.id);
  }

  private async handleChannelSwitch(oldState: VoiceState, newState: VoiceState, sessionId: string): Promise<void> {
    if (!oldState.member || !newState.member) {
      this.container.console.warn("No se encontró miembro en el estado de voz para el cambio de canal.");
      return;
    }

    if (!oldState.channel || !newState.channel) {
      this.container.console.warn("No se encontró canal en el estado de voz para el cambio de canal.");
      return;
    }

    await this.processVoiceSession(oldState.member, sessionId, oldState.channel.id, newState.channel.id);
  }

  private getRandomXP(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private async doesChannelExist(guild: Guild, channelId: string): Promise<boolean> {
    try {
      const channel = await guild.channels.fetch(channelId);
      return channel != null;
    } catch {
      return false;
    }
  }
}
