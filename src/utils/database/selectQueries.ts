import type {  GuildMember } from "discord.js";
import { Prisma } from "../../../prisma/PrismaClient";

// Verificar si el miembro existe en la base de datos de Voice
export async function isMemberInVoiceExperienceDatabase(member: GuildMember): Promise<boolean> {
    const existingUser = await Prisma.usersVoiceExperienceData.findUnique({
      where: {
        UserID_GuildID: {
          UserID: member.id,
          GuildID: member.guild.id,
        },
      },
      select: {
      }

      
    });
    return !!existingUser;
}
// Verificar si el miembro existe en la base de datos de Text
export async function isMemberInTextExperienceDatabase(member: GuildMember): Promise<boolean> {
  const existingUser = await Prisma.usersTextExperienceData.findUnique({
    where: {
      UserID_GuildID: {
        UserID: member.id,
        GuildID: member.guild.id,
      },
    },
  });
  return !!existingUser;
}

export async function getVoiceInterval(guildId: string): Promise<number> {
  const guildData = await Prisma.guildsData.findUnique({
    where: {
      GuildID: guildId,
    },
  });

  return guildData?.VoiceSpeedDefault ?? 1000;
}