import { Guild, TextChannel, GuildMember, Channel } from "discord.js";
import { Listener, Events } from "@sapphire/framework";
import { Time } from "@sapphire/time-utilities";
import { Prisma } from "../../../client/PrismaClient";
import { getRandomXP } from "../../../utils/functions/General/getRandomXP";
import calculateLevelXP from "../../../utils/functions/General/calculateLevelXP";
import config from "../../../config";
import Client from "../../../index";

interface GuildData {
  VoiceExpEnabled: boolean;
  VoiceExperienceMin?: number;
  VoiceExperienceMax?: number;
  VoiceDefaultMessage?: string;
}

export class AddVoiceExperienceListener extends Listener {
  private readonly minMaxExpCache: Map<string, { min: number; max: number }> = new Map();
  private readonly notificationMessageCache: Map<string, string> = new Map();
  private guildsDataCache: { [guildID: string]: GuildData } = {};
  private getGuildFromCache(guildID: string): Guild | undefined { return Client.guilds.cache.get(guildID) }
  private getMemberFromCache(guild: Guild, memberID: string): GuildMember | undefined { return guild.members.cache.get(memberID) }
  private getChannelFromCache(channelID: string): Channel | undefined { return Client.channels.cache.get(channelID) }

  public constructor(context: Listener.Context, options: Listener.Options) {
    super(context, {
      ...options,
      event: Events.ClientReady,
    });
  }

  private async getMinMaxEXP(guild: Guild) {
    const guildID = guild.id as string;
    const cachedValue = this.minMaxExpCache.get(guildID);
    if (cachedValue && this.areMinMaxValuesUpToDate(cachedValue, guildID)) {
      return cachedValue;
    }
  
    const guildData = await Prisma.guildsData.findUnique({ where: { GuildID: guildID } });
    const minMaxExp = {
      min: guildData?.VoiceExperienceMin ?? 5,
      max: guildData?.VoiceExperienceMax ?? 20,
    };
  
    this.minMaxExpCache.set(guildID, minMaxExp);
    return minMaxExp;
  }
  
  private areMinMaxValuesUpToDate(cachedValue: { min: number; max: number }, guildID: string) {
    const guildData = this.guildsDataCache[guildID];
    return guildData && cachedValue.min === guildData.VoiceExperienceMin && cachedValue.max === guildData.VoiceExperienceMax;
  }  

  private async updateVoiceExperience(UserID: string, GuildID: string, Experience: number, min: number, max: number) {
    const updatedUser = await Prisma.usersVoiceExperienceData.upsert({
      where: { UserID_GuildID: { UserID, GuildID } },
      create: { UserID, GuildID, VoiceExperience: Experience, TotalExperience: Experience },
      update: { VoiceExperience: { increment: Experience }, TotalExperience: { increment: Experience } },
    });
  
    const randInt = await getRandomXP(min, max);
    let levelUp = false;
  
    if (updatedUser) {
      updatedUser.VoiceExperience += randInt;
      updatedUser.TotalExperience += randInt;
  
      const xpHastaNivel = calculateLevelXP(updatedUser.Nivel);
      if (updatedUser.VoiceExperience >= xpHastaNivel) {
        updatedUser.VoiceExperience -= xpHastaNivel;
        updatedUser.Nivel++;
        levelUp = true;
      }
  
      await Prisma.usersVoiceExperienceData.update({
        where: { UserID_GuildID: { UserID, GuildID } },
        data: { Nivel: updatedUser.Nivel, VoiceExperience: Math.floor(updatedUser.VoiceExperience), TotalExperience: updatedUser.TotalExperience }
      });
  
      this.minMaxExpCache.delete(GuildID);
    }
    return { ...updatedUser, levelUp };
  }

  private async AddMissingRoles(UserID: string, GuildID: string, userNivel: number) {
    const guild = this.getGuildFromCache(GuildID);
    const member = this.getMemberFromCache(guild, UserID);
    if (guild && member) {
      const existingRoles = member.roles.cache;
      const voiceRoles = await Prisma.voiceRoleRewards.findMany({ where: { GuildID, Nivel: { lte: userNivel } }, orderBy: { Nivel: "asc" } });
      const rolesToAdd: string[] = [];
      for (const voiceRole of voiceRoles) {
        const roleID: string = voiceRole.RoleID;
        if (!existingRoles.has(roleID)) {
          rolesToAdd.push(roleID);
        }
      }

      if (rolesToAdd.length > 0) {
        await member.roles.add(rolesToAdd).catch(() => { });
      }
    }
  }

  private async getNotificationMessage(GuildID: string): Promise<string> {
    const cachedMessage = this.notificationMessageCache.get(GuildID);
    if (cachedMessage && this.isNotificationMessageUpToDate(cachedMessage, GuildID)) {
      return cachedMessage;
    }
  
    const guildData = await Prisma.guildsData.findUnique({ where: { GuildID: GuildID } });
    const notificationMessage = guildData?.VoiceDefaultMessage ?? "¡Felicidades {user}! has subido a nivel `{level}` en canales de voz. **¡GG!**";
    this.notificationMessageCache.set(GuildID, notificationMessage);
    return notificationMessage;
  }
  
  private isNotificationMessageUpToDate(cachedMessage: string, guildID: string) {
    const guildData = this.guildsDataCache[guildID];
    return guildData && cachedMessage === guildData.VoiceDefaultMessage;
  }

  private async getNotificationChannel(GuildID: string, UserID: string, userNivel: number) {
    let message = await this.getNotificationMessage(GuildID);
    const userMention = `<@${UserID}>`;
    const messageWithUserAndNivel = message.replace(/\{user\}/g, userMention).replace(/\{level\}/g, userNivel.toString());
    const getChannel = await Prisma.configChannels.findUnique({ where: { GuildID: GuildID } });
    const getVoiceAchievementChannel = getChannel?.VcXPNotification as string;
    const VoiceAchievementChannel = this.getChannelFromCache(getVoiceAchievementChannel) as TextChannel;
    if (VoiceAchievementChannel) {
      VoiceAchievementChannel.send(messageWithUserAndNivel);
    }
  }

  private async handleLevelUp(UserID: string, GuildID: string, userNivel: number) {
    await this.getNotificationChannel(GuildID, UserID, userNivel);
    await this.AddMissingRoles(UserID, GuildID, userNivel);
  }

  private async processGuilds() {
    const Guilds = Array.from(Client.guilds.cache.values());
    for (const Guild of Guilds) {
      const GuildData = this.guildsDataCache[Guild.id];
      if (GuildData?.VoiceExpEnabled === false) { continue }
      const afkchannel = Guild.afkChannel;
      const VoiceChannelMembers = Guild.voiceStates.cache.filter((vs) => vs.channel && !vs.member?.user.bot && !vs.member?.voice.selfMute &&
        !vs.member?.voice.selfDeaf && !vs.member?.voice.serverDeaf && !vs.member?.voice.serverMute && vs.member?.voice.channelId !== afkchannel?.id);
      const memberUpdates: Promise<void>[] = [];
      for (const member of VoiceChannelMembers.values()) {
        const UserID = member.member?.user.id as string;
        const GuildID = Guild.id;
        const { min, max } = await this.getMinMaxEXP(Guild);
        const experience = await getRandomXP(min, max);
        const updatePromise = this.updateVoiceExperience(UserID, GuildID, experience, min, max)
          .then((updatedUser) => {
            if (updatedUser.levelUp) {
              return this.handleLevelUp(UserID, GuildID, updatedUser.Nivel);
            }
          });

        memberUpdates.push(updatePromise);
      }

      await Promise.all(memberUpdates);
    }
  }

  public async run() {
    await this.processGuilds();
    setTimeout(() => {
      this.run();
    }, Time.Second * config.BotSettings.DefaultVoiceExperienceSpeed);
  }
}