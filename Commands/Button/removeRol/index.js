const { EmbedBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const connection = require("../../../Database/database");

module.exports = {
  build: async (interaction, actionRowBuilder, disabled, options) => {
    actionRowBuilder.addComponents(
      new ButtonBuilder()
        .setCustomId(`removeRol_u${interaction.member.id}_${options.join(",")}`)
        .setLabel("Retirar")
        .setDisabled(disabled)
        .setStyle(ButtonStyle.Danger)
    );
  },

  run: async (client, interaction) => {
    const customIDsplitted = interaction.customId.split(/_+/g);
    const rol = customIDsplitted[2].split(/,+/g)[0];
    try {
      interaction.member.roles.remove(rol);
      await interaction.update({
        content: "¡Éxito!",
        embeds: [],
        components: [],
      });
    } catch (err) {
      console.log(err);
      await interaction.update({
        content: "¡Error!",
        embeds: [],
        components: [],
      });
    }
  },
};
