import { Listener, Events } from "@sapphire/framework";
import { Message, TextChannel } from "discord.js";
import { Time } from "@sapphire/time-utilities";
import { Prisma } from "../../../client/PrismaClient";
import Client from "../../../index";
import config from "../../../config";
import calculateTextLevelXP from "../../../utils/functions/General/calculateLevelXP";
const cooldowns = new Set<string>();

export class TextExperienceListener extends Listener {
  public constructor(context: Listener.Context, options: Listener.Options) {
    super(context, {
      ...options,
      once: false,
      event: Events.MessageCreate,
    });
  }
// Declaramos la función para determinar si el servidor está en la base de datos.
  private async isGuildInDatabase(message: Message): Promise<boolean> {
    const guildID = message.guild?.id;
    if (!guildID) return false;
    const existingGuild = await Prisma.guildsData.findUnique({ where: { GuildID: guildID }});
    if (!existingGuild) {
      await Prisma.guildsData.create({ data: { GuildID: guildID, Prefix: '!' } });
    }
    return !!existingGuild;
  }
// Declaramos la función para determinar si la experiencia por texto está habilitada en el servidor.
  private async isTextExperienceModuleEnabled(message: Message): Promise<boolean> {
    await this.isGuildInDatabase(message);
    const guildID = message.guild?.id;
    if (!guildID) return false;
    const guildData = await Prisma.guildsData.findUnique({ where: { GuildID: guildID } });
    return guildData?.TextExpEnabled !== false;
  }
// Declaramos la función para determinar la experiencia random que se puede ganar por mensaje.
  private getRandomXP(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
// Obtenemos el mínimo y máximo de experiencia que se puede ganar por mensaje.
  private async getMinMaxEXP(message: Message): Promise<{ min: number; max: number }> {
    const guildID = message.guild?.id;
    if (!guildID) return { min: 5, max: 20 };
    const guildData = await Prisma.guildsData.findUnique({ where: { GuildID: guildID } });
    return {
      min: guildData?.TextExperienceMin ?? 5,
      max: guildData?.TextExperienceMax ?? 20,
    };
  }
// Declaramos la función para obtener el canal de texto donde se enviará la notificación de nivel.
  private async getTextNotificationChannel(message: Message): Promise<string | undefined> {
    const guildID = message.guild?.id;
    if (!guildID) return;
    const guildData = await Prisma.configChannels.findUnique({ where: { GuildID: guildID }
    });
    return guildData?.TextXPNotification ?? undefined;
  }
// Declaramos la función para obtener el canal de texto donde se enviará la notificación de nivel.
  private async addMissingTextRoles(UserID: string, GuildID: string, userNivel: number) {
    const guild = Client.guilds.cache.get(GuildID);
    const member = guild?.members.cache.get(UserID);

    if (guild && member) {
      const existingRoles = member.roles.cache;
      const textRoles = await Prisma.textRoleRewards.findMany({
        where: { GuildID: GuildID, Nivel: { lte: userNivel } },
        orderBy: { Nivel: 'asc'}
      });

      const rolesToAdd: string[] = [];
      for (const textRole of textRoles) {
        const roleID: string = textRole.RoleID;
        if (!existingRoles.has(roleID)) {
          rolesToAdd.push(roleID);
        }
      }

      if (rolesToAdd.length > 0) {
        await member.roles.add(rolesToAdd).catch(() => {});
      }
    }
  }
// Declaramos la función para obtener el mensaje de nivel por defecto.
  private async getAchievementMessage(GuildID: string): Promise<string> {
    const getMessage = await Prisma.guildsData.findUnique({ where: { GuildID: GuildID }
    });
    return getMessage?.TextDefaultMessage || 'Felicidades {user} has subido a nivel `{level}`.';
  }
// Declaramos la función run para ejecutar el listener al completo y llamar las funciones necesarias.
  public async run(message: Message) {
    const channel = await this.getTextNotificationChannel(message);
    const isEnabled = await this.isTextExperienceModuleEnabled(message);
    if (!isEnabled || !message.guild || message.author.bot || !message.inGuild() || cooldowns.has(message.author.id)) {
      return;
    }

    const { min, max } = await this.getMinMaxEXP(message);
    const XpToGive = this.getRandomXP(min, max);

    const level = await Prisma.usersTextExperienceData.findUnique({
      where: { UserID_GuildID: { UserID: message.author.id, GuildID: message.guildId as string } }
  });

    if (level){
      level.TextExperience += XpToGive;
      if(level.TextExperience > calculateTextLevelXP(level.Nivel)){
        level.TextExperience = 0;
        level.Nivel += 1;
        level.TotalExperience += XpToGive;

        const userMention = `${message.author}`;
        let achievementmessage = await this.getAchievementMessage(message.guildId as string)
        if(!achievementmessage){
          achievementmessage = 'Felicidades {user} has subido a nivel \`{level}\`'
        }

        const messageWithUserLevel = achievementmessage.replace(/\{user\}/g, userMention).replace(/\{level\}/g, level?.Nivel.toString());
        const SendMessageChannel = message.guild.channels.cache.get(channel as string) as TextChannel;
        if(SendMessageChannel){
          SendMessageChannel.send(messageWithUserLevel);
        } else{
          Client.MessageEmbed(message, messageWithUserLevel);
        }

        await this.addMissingTextRoles(message.author.id, message.guildId as string, level.Nivel)
      }

      await Prisma.usersTextExperienceData.update({
        where: { UserID_GuildID: { UserID: message.author.id, GuildID: message.guildId as string}},
        data: { TextExperience: level.TextExperience, Nivel: level.Nivel, TotalExperience: level.TotalExperience+ XpToGive}
      })
    } else {
      await Prisma.usersTextExperienceData.create({ data: { UserID: message.author.id, GuildID: message.guildId, TextExperience: XpToGive, TotalExperience: XpToGive }})
    }
//  Agregamos un cooldown cada que se agrega experiencia por texto.
     cooldowns.add(message.author.id);
     setTimeout(() => {
       cooldowns.delete(message.author.id);
     }, Time.Second * config.BotSettings.DefaultTextExperienceCooldown);
  }
}