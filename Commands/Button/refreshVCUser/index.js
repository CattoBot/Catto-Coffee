const {
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  PermissionFlagsBits,
} = require("discord.js");

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

module.exports = {
  build: async (interaction, actionRowBuilder, disabled, options) => {
    actionRowBuilder.addComponents(
      new ButtonBuilder()
        .setCustomId(
          `refreshVCUser_u${interaction.member.id}_${options.join(",")}`
        )
        .setLabel("Actualizar")
        .setDisabled(disabled)
        .setStyle(ButtonStyle.Primary)
    );
  },

  run: async (client, interaction) => {
    const customIDsplitted = interaction.customId.split(/_+/g);
    const usuario = customIDsplitted[2].split(/,+/g)[0];
    const user = interaction.guild.members.cache.get(usuario);
    try {
      if (!user)
        return client.sendEmbed(
          interaction,
          "Usuario no reconocido",
          "#fb6444"
        );

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
      require("../../Select/voiceuser").build(interaction, row, disabled, [
        user.id,
      ]);
      const boton = new ActionRowBuilder();
      require(".").build(interaction, boton, false, [user.id]);

      await interaction.update({ embeds: [embed], components: [row, boton] });
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
