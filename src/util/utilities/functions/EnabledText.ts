import { Subcommand } from "@sapphire/plugin-subcommands";
import { Guild } from "discord.js";
import { Database } from "../../../structures/Database";
import { Utils } from "../../utils";


export async function verifyEnableText(Enabled: Guild, Interaction: Subcommand.ChatInputCommandInteraction) {
    const guild = await Database.guildsData.findUnique({
      where: {
        GuildID: Enabled.id,
      },
    });

    if (guild?.TextExpEnabled === false) {
      if (Interaction.deferred) {
        return Interaction.editReply({
          content: `La experiencia por texto está desactivada en este servidor. ❌`,
        });
      } else {
        return Interaction.reply({
          content: `La experiencia por texto está desactivada en este servidor. ${Utils.getEmojis().General.Error}`,
          ephemeral: true,
        });
      }
    }
  }