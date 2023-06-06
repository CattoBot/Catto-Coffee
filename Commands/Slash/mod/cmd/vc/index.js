const { PermissionFlagsBits } = require("discord.js");

const { subcommandGroupBuilder } = require("../../../../../handlers/classes");
const command = new subcommandGroupBuilder(
  {
    name: "vc",
    description: "Comandos de moderación en VC",
    userPermissions: PermissionFlagsBits.MuteMembers,
    botPermissions: PermissionFlagsBits.MuteMembers,
  },
  "mod"
);

module.exports = { command: command };
