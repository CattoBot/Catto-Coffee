const { PermissionFlagsBits } = require("discord.js");

const { subcommandGroupBuilder } = require("../../../../../handlers/classes");
const command = new subcommandGroupBuilder(
  {
    name: "notes",
    description: "Comandos para notas de staff",
    userPermissions: PermissionFlagsBits.ManageMessages,
    botPermissions: PermissionFlagsBits.ManageMessages,
  },
  "mod"
);

module.exports = { command: command };
