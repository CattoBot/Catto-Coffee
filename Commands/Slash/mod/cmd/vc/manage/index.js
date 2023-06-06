// chat input slash commands
const {
  CommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
} = require("discord.js");
const { Bot } = require("../../../../../../handlers/Client");

const emojis = {
  selfMuted: "<:selfMuted:1092727485919154246>",
  serverMuted: "<:serverMute:1092727481464799292>",
  selfDeafen: "<:selfDeafened:1092727483289313290>",
  serverDeafen: "<:serverDeafened:1092727528038350919>",
  unmute: "<:unmute:1092728384401965166>",
  undeafen: "<:undeafened:1092728381499523132>",
  mod: "<:moderator:1092825523849273384>",
  admin: "<:admin:1092832350783688785>",
};

const { subcommandBuilder } = require("../../../../../../handlers/classes");
const command = new subcommandBuilder({
  name: "manage",
  description: "Gestiona un canal de voz como moderador/a",
  userPermissions: PermissionFlagsBits.MuteMembers,
  botPermissions: PermissionFlagsBits.MuteMembers,
  options: [
    {
      name: "channel",
      description: "¿Quieres gestionar un canal en el que no estás?",
      required: false,
      type: 7,
      channel_types: [2, 13],
    },
  ],
});

module.exports = {
  command: command,
  /**
   *
   * @param {Bot} client
   * @param {CommandInteraction} interaction
   */
  run: async (client, interaction) => {
    const miembro = interaction.member;

    if (
      !miembro.permissions.has(PermissionFlagsBits.MuteMembers) ||
      !miembro.permissions.has(PermissionFlagsBits.MoveMembers)
    ) {
      return client.sendEmbed(
        interaction,
        "No tienes permisos para ejecutar este comando."
      );
    }

    var channel =
      interaction.options.getChannel("channel") || miembro.voice.channel;
    if (!channel)
      return client.sendEmbed(
        interaction,
        "No se ha especificado ningún canal",
        "#fb6444"
      );

    try {
      var users = [];

      client.channels.resolve(channel.id).members.forEach((user) => {
        users.push(
          `${
            user.voice.mute
              ? `${
                  user.voice.serverMute ? emojis.serverMuted : emojis.selfMuted
                }`
              : emojis.unmute
          }${
            user.voice.deaf
              ? `${
                  user.voice.serverDeaf
                    ? emojis.serverDeafen
                    : emojis.selfDeafen
                } `
              : emojis.undeafen
          } <@${user.id}> ${
            user.permissions.has(PermissionFlagsBits.MuteMembers)
              ? `${
                  user.permissions.has(PermissionFlagsBits.ManageGuild)
                    ? `${emojis.admin}`
                    : `${emojis.mod}`
                }`
              : ""
          }`
        );
      });

      const embed = new EmbedBuilder()
        .setDescription(
          `<#${channel.id}>\n\n${
            users.length > 0
              ? users.slice(0, 25).join("\n")
              : "🦗 \\**Silencio\\**\nNo hay nadie en el canal"
          }`
        )
        .setColor("#313131");
      if (users.length > 25)
        embed.setFooter({
          text: "NO SE HA LOGRADO MOSTRAR A TODOS LOS USUARIOS",
        });

      var disabled = false;
      if (users.length < 1) disabled = true;

      const row = new ActionRowBuilder();
      require("../../../../../Select/voicemanage").build(
        interaction,
        row,
        disabled,
        [channel.id]
      );
      const boton = new ActionRowBuilder();
      require("../../../../../Button/refreshVCManage").build(
        interaction,
        boton,
        false,
        [channel.id]
      );
      if (interaction.deferred) {
        await interaction.editReply({
          embeds: [embed],
          components: [row, boton],
        });
      } else {
        await interaction.reply({
          embeds: [embed],
          components: [row, boton],
        });
      }
    } catch (err) {
      console.log(err);
      return client.sendEmbed(
        interaction,
        `Algo me ha impedido acceder a los datos del canal.\nRevisa los permisos del bot.`,
        "#fb6444"
      );
    }
  },
};
