import { Precondition } from "@sapphire/framework";
import { Database } from "../structures/Database";
import { CommandInteraction } from "discord.js";
import  { Utils } from '../util/utils'
const { Emojis } = Utils


export class VoiceMasterEnabled extends Precondition {
  public async chatInputRun(interaction: CommandInteraction) {
    const tempVoice = await Database.configTempChannels.findMany({
      where: {
        GuildID: interaction.guild?.id
      },
    });
    if (tempVoice.length > 0) {
      return this.ok();
    } else {
      return this.error({
        message: `${Emojis.General.Error} Parece que en este servidor no se ha configurado el sistema de canales de voz temporales.`
      });
    }
  }
}