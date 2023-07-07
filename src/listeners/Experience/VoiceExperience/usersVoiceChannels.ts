import { Events, Listener } from '@sapphire/framework';
import { Prisma } from '../../../client/PrismaClient';
import Client from '../../../index';

export class VoiceChannelUsers extends Listener {
  constructor(context: Listener.Context, options: Listener.Options) {
    super(context, {
      ...options,
      once: true,
      event: Events.ClientReady
    });
  }
  // Declaramos la función para agregar los usuarios que se encuentren en un canal de voz a la base de datos.
  public async run(): Promise<void> {
    for (const guild of Client.guilds.cache.values()) {
      const guildUsersIDs: string[] = [];
      const voiceChannelMembers = guild.voiceStates.cache.filter(vs => vs.channel && !vs.member?.user.bot);
      for (const voiceState of voiceChannelMembers.values()) {
        if (voiceState.member?.id) {
          guildUsersIDs.push(voiceState.member.id);
        }
      }
      if (guildUsersIDs.length === 0) {
        continue;
      }
      const existingUsers = await Prisma.usersVoiceExperienceData.findMany({
        where: {
          UserID: { in: guildUsersIDs },
          GuildID: guild.id
        },
        select: { UserID: true }
      });
      const existingUsersIDs: string[] = existingUsers.map(user => user.UserID);
      const newUsersIDs = guildUsersIDs.filter(id => !existingUsersIDs.includes(id));
      const newUsersData = newUsersIDs.map(userID => ({
        UserID: userID,
        GuildID: guild.id
      }));
      await Prisma.usersVoiceExperienceData.createMany({
        data: newUsersData, skipDuplicates: true
      });
      newUsersIDs.length = 0; // Limpiar el array de IDs de usuarios nuevos
      newUsersData.length = 0; // Limpiar el array de datos de usuarios nuevos
    }
  }
}