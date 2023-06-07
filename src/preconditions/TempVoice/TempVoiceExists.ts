import { Precondition } from "@sapphire/framework";
import { Prisma } from "../../client/PrismaClient";
import { CommandInteraction } from "discord.js";
import config from "../../config";

export class TempVoiceExists extends Precondition {
  public async chatInputRun(interaction: CommandInteraction) {
    const tempVoice = await Prisma.configTempChannels.findMany({
      where: {
        GuildID: interaction.guild?.id
      },
    });
    if (tempVoice.length > 0) {
      return this.ok();
    } else {
      return this.error({
        message: `${config.emojis.error} Parece que en este servidor no se ha configurado el sistema de canales temporales.`,
      });
    }
  }
}