const { EmbedBuilder, StringSelectMenuBuilder } = require("discord.js");
const commandData = require("../../../json/comandos.json");

module.exports = {
  build: async (interaction, actionRowBuilder, options) => {
    actionRowBuilder.addComponents(
      new StringSelectMenuBuilder()
        .setCustomId(`categoryselect_u${interaction.member.id}`)
        .setPlaceholder("Selecciona una categoría")
        .addOptions(options)
    );
  },

  run: async (client, interaction) => {
    const category = interaction.values[0];
    const categoryCommands = commandData.filter(
      (command) => command.category === category
    );
    const commandNames = categoryCommands
      .map((command) => `${command.name}`)
      .join("\n");

    const embed = new EmbedBuilder()
      .setDescription(`Aquí podrás ver los comandos disponibles. `)
      .addFields({ name: "Comandos:", value: commandNames })
      .setColor("#FFFFFF");

    try {
      await interaction.reply({
        embeds: [embed],
        components: [],
        ephemeral: true,
      });
    } catch {
      return client.sendEmbed(
        interaction,
        "Ha ocurrido un error, intentalo nuevamente",
        undefined,
        true
      );
    }
  },
};
