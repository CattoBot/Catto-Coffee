import { Listener, Events } from "@sapphire/framework";
import type { Guild, TextChannel } from "discord.js";
import { Prisma } from "../../../client/PrismaClient";
import { getRandomXP } from "../../../utils/functions/General/getRandomXP";
import Client from "../../../index";
import  calculateLevelXP  from "../../../utils/functions/General/calculateLevelXP";

export class AddVoiceExperienceListener extends Listener {
    public constructor(context: Listener.Context, options: Listener.Options) {
        super(context, {
            ...options,
            event: Events.ClientReady
        });
    }

    private async getMinMaxEXP(guild: Guild) {
        const guildData = await Prisma.guildsData.findUnique({
            where: {
                GuildID: guild.id as string
            }
        });

        if (guildData) {
            return {
                min: guildData.VoiceExperienceMin,
                max: guildData.VoiceExperienceMax
            };
        } else {
            return {
                min: 5,
                max: 20
            };
        }
    }

    private async updateVoiceExperience(UserID: string, GuildID: string, Experience: number, min: number, max: number) {
        const updatedUser = await Prisma.usersVoiceExperienceData.update({
            where: {
              UserID_GuildID: {
                UserID,
                GuildID,
              },
            },
            data: {
              VoiceExperience: { increment: Experience },
              TotalExperience: { increment: Experience },
            },
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
                where: {
                  UserID_GuildID: {
                    UserID,
                    GuildID,
                  },
                },
                data: {
                  Nivel: updatedUser.Nivel,
                  VoiceExperience: Math.floor(updatedUser.VoiceExperience),
                  TotalExperience: updatedUser.TotalExperience,
                },
              });
            }
          
            return { ...updatedUser, levelUp };
    }

    private async AddMissingRoles(UserID: string, GuildID: string, userNivel: number) {
        const guild = Client.guilds.cache.get(GuildID);
        const member = guild?.members.cache.get(UserID);
      
        if (guild && member) {
          const existingRoles = member.roles.cache; 
      
          const voiceRoles = await Prisma.voiceRoleRewards.findMany({
            where: {
              GuildID,
              Nivel: { lte: userNivel },
            },
            orderBy: {
              Nivel: 'asc',
            },
          });
      
          const rolesToAdd: string[] = [];
          for (const voiceRole of voiceRoles) {
            const roleID: string = voiceRole.RoleID;
            if (!existingRoles.has(roleID)) {
              rolesToAdd.push(roleID);
            }
          }
      
          if (rolesToAdd.length > 0) {
              await member.roles.add(rolesToAdd).catch(() => {});
          }
        }
    }

    private async getNotificationMessage(GuildID: string):Promise<string> {
        const messageExists = await Prisma.guildsData.findUnique({
          where: {
            GuildID: GuildID,
          }
        });
      
        if (messageExists) {
          return messageExists.VoiceDefaultMessage ?? '¡Felicidades {user}! has subido a nivel `{nivel}` en canales de voz. **¡GG!**';
        } else {
          return '';
        }
    }

    private async getNotificationChannel(GuildID: string, UserID: string, userNivel: number){
        const respuesta = await this.getNotificationMessage(GuildID);
        const userMention = `<@${UserID}>`;
        const messageWithUserAndNivel = respuesta.replace(/\{user\}/g, userMention).replace(/\{nivel\}/g, userNivel.toString());
      
        const getChannel = await Prisma.configChannels.findUnique({
          where: {
            GuildID: GuildID,
          }
        });
      
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

    public async run() {
        setInterval(async () => {
            await Promise.all(
                Client.guilds.cache.map(async (guild) => {
                    const guildData = await Prisma.guildsData.findUnique({
                        where: {
                          GuildID: guild.id,
                        },
                      });
                
                      if (guildData?.VoiceExpEnabled === false) {
                        return;
                      }
    
                      const VoiceChannelMembers = guild.voiceStates.cache.filter(
                        (vs) =>
                          vs.channel &&
                          !vs.member?.user.bot &&
                          !vs.member?.voice.selfMute &&
                          !vs.member?.voice.selfDeaf &&
                          !vs.member?.voice.serverDeaf &&
                          !vs.member?.voice.serverMute
                      );
    
                      await Promise.all(
                        VoiceChannelMembers.map(async (member) => {
                            const UserID = member.member?.user.id as string;
                            const GuildID = guild.id;
                            const { min, max } = await this.getMinMaxEXP(guild);
                            const experience = await getRandomXP(min, max);
    
                            const MemberExistsInDB = await Prisma.usersVoiceExperienceData.findUnique({
                                where: {
                                  UserID_GuildID: {
                                    UserID,
                                    GuildID,
                                  },
                                },
                              });
    
                              if (!MemberExistsInDB) {
                                  await Prisma.usersVoiceExperienceData.create({
                                    data: {
                                      UserID,
                                      GuildID,
                                    },
                                });
                                let updatedUser = await this.updateVoiceExperience(UserID, GuildID, experience, min, max);
                                if(updatedUser.levelUp){
                                    await this.handleLevelUp(UserID, GuildID, updatedUser.Nivel);
                                }
                            }
                        })
                    )
                })
            )
        }, 60000);

    }
}
