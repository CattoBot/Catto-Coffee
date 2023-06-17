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
      const createUsersPromises = newUsersIDs.map(async userID => {
        await Prisma.usersVoiceExperienceData.create({
          data: {
            UserID: userID,
            GuildID: guild.id
          },
        });
      });
      await Promise.all(createUsersPromises);
    }
  }
}