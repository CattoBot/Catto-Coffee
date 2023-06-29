import { Listener, Events } from "@sapphire/framework";
import { Prisma } from "../../../client/PrismaClient";
import { GuildMember, VoiceState } from "discord.js";

export class storeVoiceUsersInDatabase extends Listener {
  public constructor(context: Listener.Context, options: Listener.Options) {
    super(context, {
      ...options,
      once: false,
      event: Events.VoiceStateUpdate
    });
  }

  private async addNewMember(member: GuildMember) {
      await Prisma.usersVoiceExperienceData.createMany({
        data: {
          UserID: member.id,
          GuildID: member.guild.id,
        },
        skipDuplicates: true,
      });
  }

  public async run(newState: VoiceState) {
    const member = newState.member as GuildMember;
    if (!member || member.user.bot) return;
    await this.addNewMember(member);
  }
}