import { ApplyOptions } from "@sapphire/decorators";
import { container } from "@sapphire/framework";
import { Events, Listener } from "@sapphire/framework";
import { Time } from "@sapphire/time-utilities";
import { Guild, GuildMember, TextChannel, VoiceState } from "discord.js";

@ApplyOptions<Listener.Options>({ event: Events.VoiceStateUpdate, once: false })
export class VoiceLevelingCoreModule extends Listener<typeof Events.VoiceStateUpdate> {
  constructor(context: Listener.LoaderContext, options: Listener.Options) {
    super(context, { ...options });
  }

  public async run(oldState: VoiceState, newState: VoiceState): Promise<void> {
    if (!newState.member || newState.member.user.bot) {
      this.container.console.warn("Member not found in the new voice state or is a bot.");
      return;
    }

    const sessionId = `voiceSession:${newState.member.id}:${newState.guild.id}`;

    try {
      if (newState.channel && !oldState.channel) {
        await this.handleChannelJoin(sessionId);
      } else if (!newState.channel && oldState.channel) {
        await this.handleChannelLeave(oldState, sessionId);
      } else if (newState.channel && oldState.channel && newState.channel.id !== oldState.channel.id) {
        await this.handleChannelSwitch(oldState, newState, sessionId);
      }
    } catch (error) {
      this.container.console.error(`Error processing voice state update: ${error}`);
    }
  }

  private async handleChannelJoin(sessionId: string): Promise<void> {
    await this.container.redis.set(sessionId, JSON.stringify({ startTime: Date.now() }));
  }

  private async handleChannelLeave(oldState: VoiceState, sessionId: string): Promise<void> {
    if (!oldState.member) return;
    await this.processVoiceSession(oldState.member, sessionId, oldState.channel?.id!);
  }

  private async handleChannelSwitch(oldState: VoiceState, newState: VoiceState, sessionId: string): Promise<void> {
    if (!oldState.member || !newState.channel) return;
    await this.processVoiceSession(oldState.member, sessionId, oldState.channel?.id!, newState.channel.id);
  }

  private async processVoiceSession(member: GuildMember, sessionId: string, _oldChannelId: string, newChannelId?: string): Promise<void> {
    try {
      const sessionData = await this.loadSessionData(sessionId);
      if (!sessionData) return;

      const durationInSeconds = (Date.now() - sessionData.startTime) / 1000;
      let experience = await this.calculateExperience(durationInSeconds, member.guild);

      const bonusPercentage = await this.getUserBonusPercentage(member);
      if (bonusPercentage > 0) {
        experience += experience * (bonusPercentage / 100);
      }

      const updatedUser = await this.updateVoiceExperience(member, member.guild.id, experience, durationInSeconds);

      const leaderboardKey = `voiceLeaderboard:${member.guild.id}`;
      await container.redis.zadd(leaderboardKey, updatedUser.totalVoiceExperience, member.user.id);

      if (updatedUser.levelUp) {
        await this.handleLevelUp(member, member.guild.id, updatedUser.voiceLevel);
      }

      if (newChannelId) {
        await this.updateRedisOnChannelSwitch(sessionId);
      } else {
        await this.updateRedisOnChannelLeave(sessionId);
      }
    } catch (error) {
      this.container.console.error(`Error processing voice session for ${member.displayName}: ${error}`);
      await this.container.redis.del(sessionId);
    }
  }

  private async calculateExperience(durationInSeconds: number, guild: Guild): Promise<number> {
    const { min, max, cooldown } = await this.getMinMaxEXP(guild);
    const intervals = Math.floor(durationInSeconds / cooldown);
    return Math.floor(Math.random() * (max - min + 1)) + min * intervals;
  }

  private async getMinMaxEXP(guild: Guild): Promise<{ min: number; max: number; cooldown: number }> {
    const cacheKey = `voiceExpSettings:${guild.id}`;
    const cachedData = await this.container.redis.get(cacheKey);
    if (cachedData) return JSON.parse(cachedData);

    const voiceData = await this.container.prisma.i_voice_experience.findUnique({ where: { guildId: guild.id } });
    const expData = {
      cooldown: voiceData?.cooldown ?? Time.Minute,
      min: voiceData?.min ?? 5,
      max: voiceData?.max ?? 20
    };
    await this.container.redis.set(cacheKey, JSON.stringify(expData), 'EX', 3600);
    return expData;
  }

  private async updateVoiceExperience(member: GuildMember, guildId: string, experience: number, duration: number): Promise<any> {
    const updatedUser = await this.container.prisma.voice_experience.upsert({
      where: { guildId_userId: { guildId, userId: member.user.id } },
      update: { voiceExperience: { increment: experience }, totalVoiceExperience: { increment: experience } },
      create: {
        userId: member.user.id,
        guildId,
        voiceExperience: experience,
        totalVoiceExperience: experience,
        totalTimeInVoiceChannel: duration,
      },
    });
    const { voiceLevel: currentLevel, voiceExperience: currentExperience } = updatedUser;
    const { levelUp, newLevel, newExperience } = await this.calculateLevelUp(member.user.id, guildId, currentExperience, currentLevel);

    return { ...updatedUser, voiceLevel: newLevel, voiceExperience: newExperience, levelUp };
  }

  private async calculateLevelUp(userId: string, guildId: string, currentExperience: number, currentLevel: number): Promise<{ levelUp: boolean, newLevel: number, newExperience: number }> {
    let levelUp = false;
    let xpNeeded = this.container.helpers.leveling.xp.experienceFormula(currentLevel);

    while (currentExperience >= xpNeeded) {
      currentLevel++;
      currentExperience -= xpNeeded;
      xpNeeded = this.container.helpers.leveling.xp.experienceFormula(currentLevel);
      levelUp = true;
    }

    if (levelUp) {
      await this.container.prisma.voice_experience.update({
        where: { guildId_userId: { guildId, userId } },
        data: { voiceLevel: currentLevel, voiceExperience: currentExperience }
      });
    }

    return { levelUp, newLevel: currentLevel, newExperience: currentExperience };
  }

  private async loadSessionData(sessionId: string): Promise<{ startTime: number } | null> {
    const sessionDataStr = await this.container.redis.get(sessionId);
    return sessionDataStr ? JSON.parse(sessionDataStr) : null;
  }

  private async updateRedisOnChannelLeave(sessionId: string): Promise<void> {
    await this.container.redis.del(sessionId);
  }

  private async updateRedisOnChannelSwitch(sessionId: string): Promise<void> {
    await this.container.redis.set(sessionId, JSON.stringify({ startTime: Date.now() }));
  }

  private async getUserBonusPercentage(member: GuildMember): Promise<number> {
    const bonusRoles = await this.container.prisma.bonus_voice_roles.findMany({ where: { guildId: member.guild.id } });
    const userRoles = new Set(member.roles.cache.keys());
    let maxBonus = 0;

    for (const role of bonusRoles) {
      if (userRoles.has(role.roleId)) {
        maxBonus = Math.max(maxBonus, role.bonus ?? 0);
      }
    }

    return maxBonus;
  }

  private async handleLevelUp(member: GuildMember, guildId: string, voiceLevel: number): Promise<void> {
    const message = await this.getNotificationMessage(guildId);
    const messageWithUserAndLevel = message.replace(/\{user}/g, `<@${member.id}>`).replace(/\{level}/g, voiceLevel.toString());
    const channelID = await this.getNotificationChannelID(guildId);
    if (channelID) {
      const channel = this.container.client.channels.resolve(channelID) as TextChannel;
      await channel?.send(messageWithUserAndLevel);
    }
  }

  private async getNotificationMessage(guildId: string): Promise<string> {
    const guildData = await this.container.prisma.i_voice_experience.findUnique({ where: { guildId } });
    return guildData?.lvlUpMsg ?? "Congratulations, {user}! You've reached level {level}!";
  }

  private async getNotificationChannelID(guildId: string): Promise<string> {
    const guildData = await this.container.prisma.i_voice_experience.findUnique({ where: { guildId } });
    return guildData?.msgChannelId ?? "";
  }
}
