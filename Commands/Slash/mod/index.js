const { CommandInteraction, PermissionFlagsBits } = require("discord.js");
const { Bot } = require("../../../handlers/Client");

const cooldowns = {};

const { commandBuilder } = require("../../../handlers/classes");
const command = new commandBuilder({
  name: "mod",
  description: "Comandos de mod",
  userPermissions: PermissionFlagsBits.SendMessages,
  botPermissions: PermissionFlagsBits.SendMessages,
});

module.exports = {
  command: command,
  /**
   *
   * @param {Bot} client
   * @param {CommandInteraction} interaction
   */
  run: async (client, interaction) => {
    try {
      const groupName = interaction.options.getSubcommandGroup();
      const subcommandName = interaction.options.getSubcommand();
      
      require(`./cmd${groupName?`/${groupName}`:""}/${subcommandName}/index.js`).run(
        client,
        interaction
      );
    } catch (err) {
      client.sendError(client, err, "/mod")
      client.sendEmbed(interaction, "Parece que hubo un error en este comando.\nPor favor, si persiste, comuníquelo.", "#ed4245")
    }
  },
};
