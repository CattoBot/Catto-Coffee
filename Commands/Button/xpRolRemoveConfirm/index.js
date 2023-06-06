const { EmbedBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const connection = require("../../../Database/database");
const util = require("util");
const query = util.promisify(connection.query).bind(connection);

module.exports = {
  build: async (interaction, actionRowBuilder, options) => {
    actionRowBuilder.addComponents(
      new ButtonBuilder()
        .setCustomId(
          `xpRolRemoveConfirm_u${interaction.member.id}_${options.join(",")}`
        )
        .setLabel("Confirmar")
        .setStyle(ButtonStyle.Secondary)
    );
  },

  run: async (client, interaction) => {
    const customIDsplitted = interaction.customId.split(/_+/g);
    const nivel = customIDsplitted[2].split(/,+/g)[0];
    const oldrol = customIDsplitted[2].split(/,+/g)[1];
    await interaction.update({
      content: "Eliminando...",
      embeds: [],
      components: [],
    });
    await query(
      `DELETE FROM roles WHERE nivel = ${nivel} AND roleID = '${oldrol}' AND guildID = '${interaction.guild.id}'`,
      async (err) => {
        if (err) {
          await interaction.editReply({ content: "ERROR" });
          client.sendError(client, err)
        }
        await interaction.editReply({
          content: "¡Se ha eliminado satisfactoriamente!",
        });
      }
    );
  },
};
