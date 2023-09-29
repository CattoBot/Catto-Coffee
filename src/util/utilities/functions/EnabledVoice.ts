import { Subcommand } from "@sapphire/plugin-subcommands";
import { Guild } from "discord.js";
import { Database } from "../../../structures/Database";
import { Utils } from "../../utils";


export async function verifyEnableVoice(Enabled: Guild, Interaction: Subcommand.ChatInputCommandInteraction) {
    const guild = await Database.guildsData.findUnique({
      where: {
        GuildID: Enabled.id,
      },
    });

    if (guild?.VoiceExpEnabled === false) {
      if (Interaction.deferred) {
        return Interaction.editReply({
          content: `La experiencia de voz está desactivada en este servidor. ❌`,
        });
      } else {
        return Interaction.reply({
          content: `La experiencia de voz está desactivada en este servidor. ${Emojis.General.Error}`,
          ephemeral: true,
        });
      }
    }
  }