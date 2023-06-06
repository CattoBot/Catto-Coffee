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
  name: "user",
  description: "Gestiona un usuario en voz como moderador/a",
  userPermissions: PermissionFlagsBits.MuteMembers,
  botPermissions: PermissionFlagsBits.MuteMembers,
  options: [
    {
      name: "user",
      description: "¿Quién es el objetivo?",
      required: true,
      type: 6,
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

    // Comprobamos los permisos del usuario
    try {
      if (
        !miembro.permissions.has(PermissionFlagsBits.MuteMembers) ||
        !miembro.permissions.has(PermissionFlagsBits.MoveMembers)
      )
        return client.sendEmbed(
          interaction,
          "No tienes permisos para ejecutar este comando."
        );
    } catch (err) {
      console.log(`Error en Mod Vc User: ${err}`);
      return client.sendEmbed(
        interaction,
        "No ha sido posible comprobar tus permisos",
        "#fb6444"
      );
    }

    const user = interaction.options.getMember("user");
    if (!user)
      return client.sendEmbed(
        interaction,
        "El usuario ofrecido no coincide",
        "#fb6444"
      );

    try {
      var disabled = !user.voice.channel;
      const embed = new EmbedBuilder();

      if (user.voice.channel) {
        var users = [];

        client.channels
          .resolve(user.voice.channel.id)
          .members.forEach((user) => {
            users.push(
              `${
                user.voice.mute
                  ? `${
                      user.voice.serverMute
                        ? emojis.serverMuted
                        : emojis.selfMuted
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

        embed
          .setDescription(
            `**<@${user.id}> se encuentra en <#${
              user.voice.channel.id
            }>**\n\n${users.slice(0, 25).join("\n")}`
          )
          .setColor("#313131");
        if (users.length > 25)
          embed.setFooter({
            text: "NO SE HA LOGRADO MOSTRAR A TODOS LOS USUARIOS",
          });
      } else {
        embed
          .setDescription("El usuario no se encuentra en ningún canal de voz")
          .setColor("#fb6444");
      }

      const row = new ActionRowBuilder();
      require("../../../../../Select/voiceuser").build(
        interaction,
        row,
        disabled,
        [user.id]
      );
      const boton = new ActionRowBuilder();
      require("../../../../../Button/refreshVCUser").build(
        interaction,
        boton,
        false,
        [user.id]
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
        `Algo me ha impedido acceder a los datos del canal.\nIntentalo nuevamente o contacta al soporte.`,
        "#fb6444"
      );
    }
  },
};
