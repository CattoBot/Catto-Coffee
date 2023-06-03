import { Listener, Events } from "@sapphire/framework";
import { Prisma } from "../../../prisma/PrismaClient";
import { GuildMember, VoiceState } from "discord.js";
const addXpIntervals = new Map();

export class VoiceStateUpdateListener extends Listener {
  public constructor(context: Listener.Context, options: Listener.Options) {
    super(context, {
      ...options,
      once: false,
      event: Events.VoiceStateUpdate
    });
  }

  private async isMemberInDatabase(member: GuildMember): Promise<boolean> {
    const existingUser = await Prisma.usersVoiceExperienceData.findUnique({
      where: {
        UserID_GuildID: {
          UserID: member.id,
          GuildID: member.guild.id,
        },
      },
    });
    
    return !!existingUser;
  }

  private async addNewMember(member: GuildMember) {
    const isMemberExist = await this.isMemberInDatabase(member);

    if (!isMemberExist) {
      await Prisma.usersVoiceExperienceData.createMany({
        data: {
          UserID: member.id,
          GuildID: member.guild.id,
        },
        skipDuplicates: true,
      });
    }
  }

  public async run(newState: VoiceState) {
    const member = newState.member as GuildMember;
    if (!member.voice.channel) {
      clearInterval(addXpIntervals.get(member.id));
      addXpIntervals.delete(member.id);
    }
    if (!member || member.user.bot) return;
    await this.addNewMember(member);
  }
}