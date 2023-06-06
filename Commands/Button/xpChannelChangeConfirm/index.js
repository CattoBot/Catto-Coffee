const { EmbedBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const connection = require("../../../Database/database");
const util = require("util");
const query = util.promisify(connection.query).bind(connection);


module.exports = {
  build: async (interaction, actionRowBuilder, options) => {
    actionRowBuilder.addComponents(
      new ButtonBuilder()
        .setCustomId(`xpChannelChangeConfirm_u${interaction.member.id}${options?`_${options.join(",")}`:""}`)
        .setLabel("Confirmar")
        .setStyle(ButtonStyle.Success)
    );
  },

  run: async (client, interaction) => {
    const customIDsplitted = interaction.customId.split(/_+/g);
    const canal = customIDsplitted[2].split(/,+/g)[0];
    await interaction.update({
      embeds: [
        new EmbedBuilder()
          .setColor("#fee528")
          .setDescription("Modificando...")
      ],
      components: [],
    });
    await query(
      `UPDATE configChannels SET vcxpnotification='${canal}' WHERE guildID='${interaction.guild.id}'`,
      async (err) => {
        if (err) {
          await interaction.editReply({ content: "ERROR", content: [] });
          console.log(err)
        }
        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor("#57f287")
              .setDescription(`¡Se ha modificado el canal exitosamente!`)
          ]
        })
      }
    );
  },
};
