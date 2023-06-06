const { EmbedBuilder, StringSelectMenuBuilder } = require("discord.js");
const rulesJSON = require("../../../json/gw.json");

module.exports = {
  build: async (interaction, actionRowBuilder, options) => {
    actionRowBuilder.addComponents(
      new StringSelectMenuBuilder()
        .setCustomId(`rules_a${interaction.member.id}`)
        .setPlaceholder("Seleccione una opción")
        .addOptions(options)
    );
  },

  run: async (client, interaction) => {
    await interaction.deferReply({ ephemeral: true });

    const selected = await interaction.values[0];

    var pages = rulesJSON.rules.pages;
    pages = pages.sort(function (a, b) {
      if (a.id > b.id) return -1;
      if (b.id < a.id) return 1;
      return 0;
    });

    var embed = new EmbedBuilder()
      .setThumbnail(
        "https://cdn.discordapp.com/avatars/998351254998753402/fa4f5b50103883e21736e88e04f9c967.png?size=256"
      )
      .setColor("#9d00ff")
      .setDescription(
        "**¡Oh oh!**\nEsta página no existe.\nPor favor contacta con un administrador y solicita que se actualice este contenido."
      );

    pages.forEach((page) => {
      if (page.id == selected) {
        embed.setColor(rulesJSON.rules.color);
        let simg = interaction.guild.iconURL();
        embed.setThumbnail(
          page.thumbnail ? (page.thumbnail != "" ? page.thumbnail : simg) : simg
        );
        if (page.description) {
          embed.setDescription(page.description);
        } else {
          embed.setDescription("** **");
        }
        if (page.fields) embed.setFields(page.fields);
        if (page.footer) embed.setFooter({ text: page.footer });
        if (page.title)
          embed.setTitle(`${page.emoji ? page.emoji + " " : ""}${page.title}`);
      }
    });

    await interaction.editReply({ embeds: [embed] });
  },
};
