const { EmbedBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const connection = require("../../../Database/database");
const util = require("util");
const query = util.promisify(connection.query).bind(connection);

module.exports = {
  build: async (interaction, actionRowBuilder, options) => {
    actionRowBuilder.addComponents(
      new ButtonBuilder()
        .setCustomId(
          `xpRolChangeConfirm_u${interaction.member.id}_${options.join(",")}`
        )
        .setLabel("Confirmar")
        .setStyle(ButtonStyle.Secondary)
    );
  },

  run: async (client, interaction) => {
    const customIDsplitted = interaction.customId.split(/_+/g);
    const nivel = customIDsplitted[2].split(/,+/g)[0];
    const rol = customIDsplitted[2].split(/,+/g)[1];
    await interaction.update({
      content: "Modificando...",
      embeds: [],
      components: [],
    });
    await query(
      `UPDATE roles SET roleID='${rol}' WHERE guildID='${interaction.guild.id}' AND nivel=${nivel}`,
      async (err) => {
        if (err) {
          await interaction.editReply({ content: "**ERROR**" });
          client.sendError(client, err)
        }
        await interaction.editReply({
          content: "¡Se ha modificado el rol exitosamente!",
        });
      }
    );
  },
};
