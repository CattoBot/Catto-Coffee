const {
  PermissionFlagsBits,
  EmbedBuilder,
  StringSelectMenuBuilder,
  ActionRowBuilder,
} = require("discord.js");
const rulesJSON = require("../../../json/gw.json");

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
  build: async (interaction, actionRowBuilder, disabled, data) => {
    actionRowBuilder.addComponents(
      new StringSelectMenuBuilder()
        .setCustomId(`voicemanage_u${interaction.member.id}_${data.join(",")}`)
        .setPlaceholder(
          disabled ? "Menú no disponible" : "Seleccione una opción"
        )
        .setDisabled(disabled)
        .addOptions(
          { label: "Registrar", emoji: "📝", value: "log" },
          {
            label: "Mute all",
            emoji: "1092727481464799292",
            value: "mute:ALL:true",
          },
          {
            label: "Unmute all",
            emoji: "1092728384401965166",
            value: "mute:ALL:false",
          },
          {
            label: "Desalojar el canal",
            emoji: "1092861994526314636",
            value: "kick:ALL",
          }
        )
    );
  },

  run: async (client, interaction) => {
    if (!interaction.member.permissions.has(PermissionFlagsBits.MuteMembers))
      return interaction.update({
        embeds: [
          new EmbedBuilder()
            .setDescription("No tienes permisos para usar esta opción.")
            .setColor("#fb6444"),
        ],
        ephemeral: true,
        components: [],
      });

    const data = interaction.customId
      .split(/_+/g)
      [interaction.customId.split(/_+/g).length - 1].split(/,+/g);
    const channel = data[0];

    var toreply = {};
    var error = { ephemeral: true };

    var selected = await interaction.values[0];
    selected = selected.replace("ME", interaction.member.id);

    var args = selected.split(/:+/g);
    for (let i = 0; i < args.length; i++) {
      args[i] = [...args[i].split(/&+/g)];
    }

    if (args[0][0] == "log") {
      var users = [];
      client.channels.resolve(channel).members.forEach((member) => {
        users.push({
          inline: true,
          name: `${
            member.permissions.has(PermissionFlagsBits.MuteMembers)
              ? member.permissions.has(PermissionFlagsBits.ManageGuild)
                ? `${emojis.admin}`
                : `${emojis.mod}`
              : ""
          } ${member.user.username}#${member.user.discriminator}`,
          value: `\`${member.id}\`\n${
            member.voice.mute
              ? `${
                  member.voice.serverMute
                    ? `${emojis.serverMuted} \`SERVER MUTED\``
                    : `${emojis.selfMuted} \`SELF MUTED\``
                }`
              : `${emojis.unmute} \`UNMUTED\``
          }\n${
            member.voice.deaf
              ? `${
                  member.voice.serverDeaf
                    ? `${emojis.serverDeafen} \`SERVER DEAFENED\``
                    : `${emojis.selfDeafen} \`SELF DEAFENED\``
                } `
              : `${emojis.undeafen} \`UNDEAFENED\``
          }\n\n** **`,
        });
      });
      toreply.embed = new EmbedBuilder()
        .setTitle("Registro")
        .setDescription(
          `${users.length} ${
            users.length == 1 ? "usuario registrado" : "usuarios registrados"
          }\n\n** **`
        )
        .setFields(users)
        .setColor("#313131");
      toreply.ephemeral = false;
    } else if (args[0][0] == "mute") {
      if (
        !interaction.member.voice.channel ||
        `${interaction.member.voice.channel.id}` != `${channel}`
      ) {
        error.embed = new EmbedBuilder()
          .setDescription(
            `Debes estar conectad@ al canal de voz para poder usar esta opción.`
          )
          .setColor("#fb6444");
      } else {
        try {
          client.channels.resolve(channel).members.forEach((user) => {
            if (
              user.id != interaction.member.id &&
              (args[1].includes(user.id) || args[1].includes("ALL")) &&
              !user.permissions.has(PermissionFlagsBits.MuteMembers) &&
              ((!user.voice.serverMute && args[2][0] == "true") ||
                (user.voice.serverMute && args[2][0] == "false"))
            ) {
              try {
                user.voice.setMute(
                  args[2][0] == "true",
                  `El usuario ${interaction.member.id} ha ejecutado una solicitud de mute en el canal ${channel}`
                );
              } catch (err) {
                console.error(err);
              }
            }
            if (
              user.id != interaction.member.id &&
              (args[1].includes(user.id) || args[1].includes("ALL")) &&
              user.permissions.has(PermissionFlagsBits.MuteMembers)
            ) {
              toreply.embed = new EmbedBuilder()
                .setDescription(
                  "Uno o más usuarios del canal no fueron modificados por sus permisos"
                )
                .setColor("#fee528");
              toreply.ephemeral = true;
            }
          });
        } catch (err) {
          console.error(err);
        }
      }
    } else if (args[0][0] == "kick") {
      try {
        client.channels.resolve(channel).members.forEach((user) => {
          if (
            (args[1].includes(user.id) &&
              !user.permissions.has(PermissionFlagsBits.KickMembers)) ||
            args[1].includes("ALL")
          ) {
            try {
              user.voice.disconnect(
                `El usuario ${interaction.member.id} ha ejecutado una solicitud de desconexión del canal ${user.voice.channel.id}`
              );
            } catch (err) {
              console.error(err);
            }
          }
          if (
            args[1].includes(user.id) &&
            !user.permissions.has(PermissionFlagsBits.KickMembers)
          ) {
            toreply.embed = new EmbedBuilder()
              .setDescription(
                "Uno o más usuarios del canal no fueron modificados por sus permisos"
              )
              .setColor("#fee528");
            toreply.ephemeral = true;
          }
        });
      } catch (err) {
        console.error(err);
      }
    }

    setTimeout(async function () {
      try {
        var users = [];
        client.channels.resolve(channel).members.forEach((user) => {
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
        const embed = new EmbedBuilder()
          .setDescription(
            `<#${channel}>\n\n${
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

        const row = new ActionRowBuilder();
        require(".").build(interaction, row, users.length < 1, [channel]);
        const boton = new ActionRowBuilder();
        require("../../Button/refreshVCManage").build(
          interaction,
          boton,
          false,
          [channel]
        );
        await interaction.update({ embeds: [embed], components: [row, boton] });
      } catch (err) {
        console.error(err);
      }

      if (error.embed) {
        try {
          await interaction.reply({
            ephemeral: error.ephemeral,
            embeds: [error.embed],
          });
        } catch {
          try {
            await interaction.reply({
              ephemeral: error.ephemeral,
              embeds: [error.embed],
            });
          } catch {}
        }
      }

      if (toreply.embed) {
        try {
          await interaction.reply({
            ephemeral: toreply.ephemeral,
            embeds: [toreply.embed],
          });
        } catch {
          try {
            await interaction.reply({
              ephemeral: toreply.ephemeral,
              embeds: [toreply.embed],
            });
          } catch {}
        }
      }
    }, 1500);
  },
};
