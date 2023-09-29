import { Listener, Events } from "@sapphire/framework";
import { Message, TextChannel } from "discord.js";
import { Time } from "@sapphire/time-utilities";
import { Database } from "../../../structures/Database";
import { Catto_Coffee } from "../../../App";
import { XPCalculator, GetRandomXP } from "../../../util/utilities/index";
import { Utils } from "../../../util/utils";
const { Cooldowns } = Utils;
const cooldowns = new Set<string>();

export class TextExperienceListener extends Listener {
  public constructor(context: Listener.Context, options: Listener.Options) {
    super(context, {
      ...options,
      once: false,
      event: Events.MessageCreate,
    });
  }

  private async isTextExperienceModuleEnabled(message: Message): Promise<boolean> {
    const guildID = message.guild?.id;
    if (!guildID) return false;
    const guildData = await Database.guildsData.findUnique({ where: { GuildID: guildID } });
    return guildData?.TextExpEnabled !== false;
  }

  private async getMinMaxEXP(message: Message): Promise<{ min: number; max: number }> {
    const guildID = message.guild?.id;
    if (!guildID) return { min: 5, max: 20 };
    const guildData = await Database.guildsData.findUnique({ where: { GuildID: guildID } });
    return {
      min: guildData?.TextExperienceMin ?? 5,
      max: guildData?.TextExperienceMax ?? 20,
    };
  }

  private async getTextNotificationChannel(message: Message): Promise<string | undefined> {
    const guildID = message.guild?.id;
    if (!guildID) return;
    const guildData = await Database.configChannels.findUnique({ where: { GuildID: guildID } });
    return guildData?.TextXPNotification;
  }

  private async addMissingTextRoles(UserID: string, GuildID: string, userNivel: number) {
    const guild = Catto_Coffee.guilds.cache.get(GuildID);
    const member = guild?.members.cache.get(UserID);

    if (guild && member) {
      const existingRoles = member.roles.cache;
      const textRoles = await Database.textRoleRewards.findMany({
        where: { GuildID: GuildID, Nivel: { lte: userNivel } },
        orderBy: { Nivel: 'asc' },
      });

      const rolesToAdd: string[] = [];
      for (const textRole of textRoles) {
        const roleID: string = textRole.RoleID;
        if (!existingRoles.has(roleID)) {
          rolesToAdd.push(roleID);
        }
      }

      if (rolesToAdd.length > 0) {
        await member.roles.add(rolesToAdd).catch(console.error);
      }
    }
  }

  private async getAchievementMessage(GuildID: string): Promise<string> {
    const getMessage = await Database.guildsData.findUnique({ where: { GuildID: GuildID } });
    return getMessage?.TextDefaultMessage || 'Felicidades {user} has subido a nivel `{level}`.';
  }

  public async run(message: Message) {
    const channel = await this.getTextNotificationChannel(message);
    const isEnabled = await this.isTextExperienceModuleEnabled(message);

    if (!isEnabled || !message.guild || message.author.bot || !message.inGuild() || cooldowns.has(message.author.id)) {
      return;
    }

    const { min, max } = await this.getMinMaxEXP(message);
    const XpToGive = await GetRandomXP(min, max);

    const level = await Database.usersTextExperienceData.findUnique({
      where: { UserID_GuildID: { UserID: message.author.id, GuildID: message.guildId as string } },
    });

    if (level) {
      const xpToAdd = XpToGive;
      level.TextExperience += xpToAdd;

      if (level.TextExperience > XPCalculator(level.Nivel)) {
        level.TextExperience = 0;
        level.Nivel += 1;
        const totalXpToAdd = XpToGive;
        level.TotalExperience += totalXpToAdd;

        const userMention = `${message.author}`;
        let achievementmessage = await this.getAchievementMessage(message.guildId as string);
        if (!achievementmessage) {
          achievementmessage = 'Felicidades {user} has subido a nivel `{level}`';
        }

        const messageWithUserLevel = achievementmessage.replace(/\{user\}/g, userMention).replace(/\{level\}/g, level?.Nivel.toString());
        const SendMessageChannel = message.guild?.channels.cache.get(channel as string) as TextChannel;

        if (SendMessageChannel) {
          await SendMessageChannel.send(messageWithUserLevel);
        } else {
           await Utils.messageEmbed(message, messageWithUserLevel);
        }

        await this.addMissingTextRoles(message.author.id, message.guildId as string, level.Nivel);
      }

      await Database.usersTextExperienceData.update({
        where: { UserID_GuildID: { UserID: message.author.id, GuildID: message.guildId as string } },
        data: { TextExperience: level.TextExperience, Nivel: level.Nivel, TotalExperience: level.TotalExperience + XpToGive },
      });
    } else {
      await Database.usersTextExperienceData.create({ data: { UserID: message.author.id, GuildID: message.guildId, TextExperience: XpToGive, TotalExperience: XpToGive } });
    }

    cooldowns.add(message.author.id);
    setTimeout(() => {
      cooldowns.delete(message.author.id);
    }, Time.Second * Cooldowns.Text);
  }
}