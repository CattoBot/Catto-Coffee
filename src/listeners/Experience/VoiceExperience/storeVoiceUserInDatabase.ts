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
// Declaramos la función para agregar los usuarios que se encuentren en un canal de voz a la base de datos.
// Esto se ejecutará cuando un nuevo usuario ingresa a un canal de voz.
  private async addNewMember(member: GuildMember) {
      await Prisma.usersVoiceExperienceData.createMany({
        data: {
          UserID: member.id,
          GuildID: member.guild.id,
        },
        skipDuplicates: true,
      });
  }
// función run para llamar nuestra función previa
  public async run(newState: VoiceState) {
    const member = newState.member as GuildMember;
    if (!member || member.user.bot) return;
    await this.addNewMember(member);
  }
}