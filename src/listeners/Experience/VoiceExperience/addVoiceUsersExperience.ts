import { Guild, TextChannel } from "discord.js";
import { Listener, Events } from "@sapphire/framework";
import { Prisma } from "../../../client/PrismaClient";
import { getRandomXP } from "../../../utils/functions/General/getRandomXP";
import calculateLevelXP from "../../../utils/functions/General/calculateLevelXP";
import config from "../../../config";
import Client from "../../../index";

export class AddVoiceExperienceListener extends Listener {
  private readonly minMaxExpCache: Map<string, { min: number, max: number }> = new Map();
  private readonly notificationMessageCache: Map<string, string> = new Map();

  public constructor(context: Listener.Context, options: Listener.Options) {
    super(context, {
      ...options,
      event: Events.ClientReady,
    });
  }

  private async getMinMaxEXP(guild: Guild) {
    const guildID = guild.id as string;
    const cachedValue = this.minMaxExpCache.get(guildID);
    if (cachedValue) {
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

  private async updateVoiceExperience(UserID: string, GuildID: string, Experience: number, min: number, max: number) {
    const updatedUser = await Prisma.usersVoiceExperienceData.update({
      where: { UserID_GuildID: { UserID, GuildID } },
      data: { VoiceExperience: { increment: Experience }, TotalExperience: { increment: Experience } },
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
    }
    return { ...updatedUser, levelUp };
  }

  private async AddMissingRoles(UserID: string, GuildID: string, userNivel: number) {
    const guild = Client.guilds.cache.get(GuildID);
    const member = guild?.members.cache.get(UserID);
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
    if (cachedMessage) {
      return cachedMessage;
    }

    const messageExists = await Prisma.guildsData.findUnique({ where: { GuildID: GuildID } });
    const notificationMessage = messageExists?.VoiceDefaultMessage ?? "¡Felicidades {user}! has subido a nivel `{nivel}` en canales de voz. **¡GG!**";
    this.notificationMessageCache.set(GuildID, notificationMessage);
    return notificationMessage;
  }

  private async getNotificationChannel(GuildID: string, UserID: string, userNivel: number) {
    let respuesta = await this.getNotificationMessage(GuildID);
    const userMention = `<@${UserID}>`;
    const messageWithUserAndNivel = respuesta.replace(/\{user\}/g, userMention).replace(/\{nivel\}/g, userNivel.toString());
    const getChannel = await Prisma.configChannels.findUnique({ where: { GuildID: GuildID } });
    const getVoiceAchievementChannel = getChannel?.VcXPNotification as string;
    const VoiceAchievementChannel = Client.channels.cache.get(getVoiceAchievementChannel) as TextChannel;

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
      const GuildData = await Prisma.guildsData.findUnique({ where: { GuildID: Guild.id } });
      if (GuildData?.VoiceExpEnabled === false) {
        continue;
      }
  
      const VoiceChannelMembers = Guild.voiceStates.cache.filter((vs) => vs.channel && !vs.member?.user.bot && !vs.member?.voice.selfMute && 
      !vs.member?.voice.selfDeaf && !vs.member?.voice.serverDeaf && !vs.member?.voice.serverMute);
      for (const member of VoiceChannelMembers.values()) {
        const UserID = member.member?.user.id as string;
        const GuildID = Guild.id;
        const { min, max } = await this.getMinMaxEXP(Guild);
        const experience = await getRandomXP(min, max);

        let updatedUser = await this.updateVoiceExperience(UserID, GuildID, experience, min, max);
        if (updatedUser.levelUp) {
          await this.handleLevelUp(UserID, GuildID, updatedUser.Nivel);
        }
      }
    }
  }
  
  public async run() {
    await this.processGuilds();
    setTimeout(() => {
      this.run();
    }, config.BotSettings.DefaultVoiceExperienceSpeed * 1000);
  }
}