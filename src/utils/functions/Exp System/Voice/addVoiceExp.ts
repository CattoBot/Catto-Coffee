import { container } from "@sapphire/framework";
import { Prisma } from "../../../../../prisma/PrismaClient";
import Client from "../../../../index";
import calculateLevelXP from "../../General/calculateLevelXP";
import { getRandomXP } from "../../General/getRandomXP";
import { Guild, TextChannel, VoiceState } from "discord.js";


async function getMinMaxEXP(VoiceState: VoiceState) {
  const guild = VoiceState.guild;
  const guildData = await Prisma.guildsData.findUnique({
    where: {
      GuildID: guild.id as string,
    },
  });

  if (guildData) {
    return {
      min: guildData.VoiceExperienceMin,
      max: guildData.VoiceExperienceMax,
    };
  } else {
    return {
      min: 5,
      max: 20,
    };
  }
}

async function updateVoiceExperience(UserID: string, GuildID: string, Experience: number, min: number, max: number) {
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

      container.logger.info(`Usuario ${UserID} subió al nivel ${updatedUser.Nivel}`);
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

async function handleLevelUp(UserID: string, GuildID: string, userNivel: number) {
  await getAchievementChannel(GuildID, UserID, userNivel);
  await addMissingVoiceRoles(UserID, GuildID, userNivel);
}

async function addMissingVoiceRoles(UserID: string, GuildID: string, userNivel: number) {
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
        container.logger.info(`Roles ${rolesToAdd.join(', ')} agregados al usuario ${UserID} en el servidor ${GuildID}`)
    }
  }
}

export async function addMembersVoiceExperience() {
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

          const { min, max } = await getMinMaxEXP(member);

          const Experience = await getRandomXP(min, max);

          const MemberExistsInDB = await Prisma.usersVoiceExperienceData.findUnique({
            where: {
              UserID_GuildID: {
                UserID,
                GuildID,
              },
            },
          });

          if (!MemberExistsInDB) {
            try {
              await Prisma.usersVoiceExperienceData.create({
                data: {
                  UserID,
                  GuildID,
                },
              });
            } catch (error) {
              container.logger.error(`Error al crear la experiencia de voz para el usuario ${UserID} en el servidor ${GuildID}: ${error}`);
            }
          }

          try {
            let updatedUser = await updateVoiceExperience(UserID, GuildID, Experience, min, max);
            container.logger.info(`Sele ha dado ${Experience} de experiencia de voz al usuario ${UserID} en el servidor ${GuildID}`)
            container.logger.info(`Usuario ${UserID} en el servidor ${GuildID} (${guild.name})`);
            container.logger.info(`Experiencia de voz: ${updatedUser.VoiceExperience}`);
            container.logger.info(`Experiencia total: ${updatedUser.TotalExperience}`);
            container.logger.info(`Nivel actual: ${updatedUser.Nivel}`);

            if (updatedUser.levelUp) {
              await handleLevelUp(UserID, GuildID, updatedUser.Nivel);
            }
          } catch (error) {
            container.logger.error(`Error al actualizar la experiencia del usuario ${UserID} en el servidor ${GuildID}: ${error}`);
          }
        })
      );
    })
  );
}

async function getAchievementChannel(GuildID: string, UserID: string, userNivel: number) {
  const respuesta = await getAchievementMessage(GuildID);
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

async function getAchievementMessage(GuildID: string): Promise<string> {
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