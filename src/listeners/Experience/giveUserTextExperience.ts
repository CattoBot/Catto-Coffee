import { Listener, Events } from "@sapphire/framework";
import { Message, TextChannel } from "discord.js";
import { Prisma } from "../../client/PrismaClient";
import Client from "../../index";
import config from "../../config";
import calculateTextLevelXP from "../../utils/functions/General/calculateLevelXP";

const cooldowns = new Set();

export class TextExperienceListener extends Listener {
    public constructor(context: Listener.Context, options: Listener.Options) {
        super(context, {
            ...options,
            once: false,
            event: Events.MessageCreate,
        });
    }

    private async isGuildinDatabase(message: Message): Promise<boolean> {
        const existingGuild = await Prisma.guildsData.findUnique({
            where: {
                GuildID: message.guild?.id as string,
            },
        });

        if (!existingGuild) {
            await Prisma.guildsData.create({
                data: {
                    GuildID: message.guild?.id as string,
                    Prefix: '!',
                    TextExperienceMin: 5,
                    TextExperienceMax: 20,
                    TextExpEnabled: true,
                    VoiceExpEnabled: true,
                    VoiceSpeedDefault: 5,
                },
            });
        }

        return !!existingGuild;
    }

    private async isTextExperienceModuleEnabled(message: Message) {
        await this.isGuildinDatabase(message);
        const guildData = await Prisma.guildsData.findUnique({
            where: {
                GuildID: message.guild?.id as string,
            },
        });

        if (guildData?.TextExpEnabled === false) {
            return false;
        }

        return true;
    }

    private async getRandomXP(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    private async getMinMaxEXP(message: Message) {
        const guildData = await Prisma.guildsData.findUnique({
            where: {
                GuildID: message.guild?.id as string,
            },
        });

        if (guildData) {
            return {
                min: guildData.TextExperienceMin,
                max: guildData.TextExperienceMax,
            };
        } else {
            return {
                min: 5,
                max: 20,
            };
        }
    }

    private async getTextNotificationChannel(message: Message) {
        const guildData = await Prisma.configChannels.findUnique({
            where: {
                GuildID: message.guild?.id as string,
            },
        });

        if (guildData) {
            return guildData.TextXPNotification;
        }
    }

    private async addMissingVoiceRoles(UserID: string, GuildID: string, userNivel: number) {
        const guild = Client.guilds.cache.get(GuildID);
        const member = guild?.members.cache.get(UserID);
      
        if (guild && member) {
          const existingRoles = member.roles.cache; 
      
          const textRoles = await Prisma.textRoleRewards.findMany({
            where: {
              GuildID,
              Nivel: { lte: userNivel },
            },
            orderBy: {
              Nivel: 'asc',
            },
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

    private async getAchievementMessage(GuildID: string){
        const getMessage = await Prisma.guildsData.findUnique({
            where: {
                GuildID: GuildID,
            }
        });

        if(getMessage){
            return getMessage.TextDefaultMessage ?? 'Felicidades {user} has subido a nivel `{nivel}`.';
        }
    }

    public async run(message: Message) {
        const channel = await this.getTextNotificationChannel(message);
    
        const isEnabled = await this.isTextExperienceModuleEnabled(message);
        if (!isEnabled || !message.guild || message.author.bot || !message.inGuild() || cooldowns.has(message.author.id)) {
            return;
        }
    
        const guildMinMaxExperience = await this.getMinMaxEXP(message);
        const min = guildMinMaxExperience.min;
        const max = guildMinMaxExperience.max;
    
        const XpToGive = await this.getRandomXP(min, max);
    
        const level = await Prisma.usersTextExperienceData.findUnique({
            where: {
                UserID_GuildID: {
                    UserID: message.author.id,
                    GuildID: message.guildId as string,
                },
            },
        });
    
        if (level) {
            level.TextExperience += XpToGive;
            if (level.TextExperience > calculateTextLevelXP(level.Nivel)) {
                level.TextExperience = 0;
                level.Nivel += 1;
                level.TotalExperience += XpToGive;

                const userMention = `${message.author}`;
                let respuesta = await this.getAchievementMessage(message.guildId as string);
                if (!respuesta) {
                    respuesta = 'Felicidades {user} has subido a nivel `{nivel}`.';
                }
                const messageWithUserAndNivel = respuesta.replace(/\{user\}/g, userMention).replace(/\{nivel\}/g, level?.Nivel.toString());
    
                const canal = message.guild?.channels.cache.get(channel as string) as TextChannel;
                if (canal) {
                    canal.send(messageWithUserAndNivel);
                }
                await this.addMissingVoiceRoles(message.author.id, message.guildId as string, level.Nivel);
            }
    
            await Prisma.usersTextExperienceData.update({
                where: {
                    UserID_GuildID: {
                        UserID: message.author.id,
                        GuildID: message.guildId as string,
                    },
                },
                data: {
                    TextExperience: level?.TextExperience,
                    Nivel: level?.Nivel,
                    TotalExperience: level?.TotalExperience + XpToGive,
                },
            });
    
            this.container.logger.info(`Se ha añadido ${XpToGive} de experiencia a ${message.author.username}`);
             cooldowns.add(message.author.id);
             setTimeout(() => {
                 cooldowns.delete(message.author.id);
             }, config.BotSettings.DefaultTextExperienceCooldown * 1000);
             return;
        } else {
            await Prisma.usersTextExperienceData.create({
                data: {
                    UserID: message.author.id,
                    GuildID: message.guildId as string,
                    TextExperience: XpToGive,
                    TotalExperience: XpToGive,
                },
            });
        }
    }
    
}
