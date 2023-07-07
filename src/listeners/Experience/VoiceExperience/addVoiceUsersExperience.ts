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

// Declaramos variables de caché donde se guardarán los datos de las consultas a la base de datos
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
// Declaramos la función para obtener la cantidad mínima y máxima de experiencia que se puede ganar en un canal de voz por servidor.
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
  // Declaramos la función para determinar si los datos de caché de la experiencia mínima y máxima están actualizados. 
  //(Esto para evitar que si se actualiza mediante el comando respectivo, se mantengan actualizados los valores y no se queden los que ya estaban guardados en caché.)
  private areMinMaxValuesUpToDate(cachedValue: { min: number; max: number }, guildID: string) {
    const guildData = this.guildsDataCache[guildID];
    return guildData && cachedValue.min === guildData.VoiceExperienceMin && cachedValue.max === guildData.VoiceExperienceMax;
  }  
// Declaramos la función para agregar la experiencia a los usuarios que se encuentren en un canal de voz. 
// Utilizamos el método Upsert de Prisma para actualizar los datos de los usuarios en la base de datos o que cree nuevos registros si no existen.
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
// Declaramos la función para obtener el mensaje de notificación de la caché que ya hemos declarado previamente
// En caso de que no exista en caché, realizamos la respectiva consulta a la base de datos, si no existe en base de datos, tenemos un mensaje que se enviará por defecto.
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
  // Declaramos la función para obtener el mensaje de la caché que ya hemos declarado previamente y verificamos si está actualizado correctamente.
  private isNotificationMessageUpToDate(cachedMessage: string, guildID: string) {
    const guildData = this.guildsDataCache[guildID];
    return guildData && cachedMessage === guildData.VoiceDefaultMessage;
  }
// Declaramos la función para obtener el canal donde se enviarán los mensajes de felicitación, en caso de que no exista, no se enviará mensaje.
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
// Declaramos la función para manejar el evento de un usuario subiendo de nivel.
// llamamos a las funciones para obtener el canal de notificación y agregar los roles que le corresponden al usuario.
  private async handleLevelUp(UserID: string, GuildID: string, userNivel: number) {
    await this.getNotificationChannel(GuildID, UserID, userNivel);
    await this.AddMissingRoles(UserID, GuildID, userNivel);
  }
// Finalmente declaramos la función para poder procesar a todos los servidores donde se encuentra el bot.
// Para ello obtenemos los datos de los servidores y los miembros que se encuentran en un canal de voz y llamamos a las funciones correspondientes.
  private async processGuilds() {
    const guilds = Array.from(Client.guilds.cache.values());
    for (const guild of guilds) {
      const guildID = guild.id;
      const guildData = this.guildsDataCache[guildID];
      if (guildData?.VoiceExpEnabled === false) {
        continue;
      }
  
      const afkChannel = guild.afkChannel;
      const voiceChannelMembers = Array.from(guild.voiceStates.cache.values()).filter((vs) =>
        vs.channel &&
        !vs.member?.user.bot &&
        !vs.member?.voice.selfMute &&
        !vs.member?.voice.selfDeaf &&
        !vs.member?.voice.serverDeaf &&
        !vs.member?.voice.serverMute &&
        vs.member?.voice.channelId !== afkChannel?.id
      );
  
      for (const member of voiceChannelMembers) {
        const userID = member.member?.user.id as string;
        const { min, max } = await this.getMinMaxEXP(guild);
        const experience = await getRandomXP(min, max);
  
        const updatedUser = await this.updateVoiceExperience(userID, guildID, experience, min, max);
        if (updatedUser.levelUp) {
          await this.handleLevelUp(userID, guildID, updatedUser.Nivel);
        }
      }
    }
  }
  // Función run que va a arrancar nuestra clase declarada previamente y agregamos un timeout para que se ejecute cada cierto tiempo.
  public async run() {
    await this.processGuilds();
    setTimeout(() => {
      this.run();
    }, Time.Second * config.BotSettings.DefaultVoiceExperienceSpeed);
  }
}