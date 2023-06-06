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
        .setCustomId(`voiceuser_u${interaction.member.id}_${data.join(",")}`)
        .setPlaceholder(
          disabled ? "Menú no disponible" : "Seleccione una opción"
        )
        .addOptions(
          { label: "Registrar", emoji: "📝", value: "log" },
          {
            label: "Mute user",
            emoji: "1092727481464799292",
            value: "mute:HIM:true",
          },
          {
            label: "Unmute user",
            emoji: "1092728384401965166",
            value: "mute:HIM:false",
          },
          {
            label: "Desconectar",
            emoji: "1092861994526314636",
            value: "kick:HIM",
          },
          {
            label: "Ir a su canal",
            emoji: "1092751257145462784",
            value: "move:ME:HIM",
          },
          {
            label: "Traer a mi canal",
            emoji: "1092751257145462784",
            value: "move:HIM:ME",
          },
          {
            label: "Ir a Soporte 1",
            emoji: "1092751257145462784",
            value: "move:US:991497166881308812",
          },
          {
            label: "Ir a Soporte 2",
            emoji: "1092751257145462784",
            value: "move:US:984943509503090708",
          },
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
            label: "Desalojar canal",
            emoji: "1092861994526314636",
            value: "kick:ALL",
          }
        )
        .setDisabled(disabled)
    );
  },

  run: async (client, interaction) => {


    // Si el usuario no posee los permisos necesarios devuelve un mensaje de error
    if (!(interaction.member.permissions.has(PermissionFlagsBits.MuteMembers) && interaction.member.permissions.has(PermissionFlagsBits.MoveMembers) && interaction.member.permissions.has(PermissionFlagsBits.KickMembers)))
      return await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription("Parece ser que no dispones de los permisos necesarios")
            .setColor("#ed4245")
        ]
      }).catch((e) => {
        client.sendError(client, e)
      })

    // Declara el array de información que obtendremos de la ID de la lista
    const data = interaction.customId.split(/_+/g)[interaction.customId.split(/_+/g).length - 1].split(/,+/g);

    // El ID del usuario será el primer valor, en este caso el único
    const user = data[0];

    // El miembro será obtenido a partir de su ID
    const member = interaction.guild.members.cache.get(user);

    // Declararemos dos variables que determinarán los mensajes que el bot devolverá una vez el trabajo de la interacción finalice
    var error = {};
    var toreply = { ephemeral: true };

    // Si el miembro no existe o abandonó el servidor, constamos como error el que el usuario no ha sido encontrado
    if (!member) {
      error.embed = new EmbedBuilder()
        .setDescription("No se reconoce al usuario")
        .setColor("#fb6444");
    }

    // De lo contrario, si no está en ningún canal de voz, indicamos un mensaje de error al no poder monitorizarlo
    else if (!member.voice.channel) {
      error.embed = new EmbedBuilder()
        .setDescription("El usuario ha abandonado los canales de voz")
        .setColor("#fb6444");
    }

    // De lo contrario, entendemos que podemos monitorizarlo y se procede
    else {

      // Obtenemos la opción que se desea llevar a cabo
      var selected = await interaction.values[0];

      // Reemplazamos las variables por valores
      selected = selected.replace("HIM", user).replace("ME", interaction.member.id);

      // Declaramos los argumentos
      var args = selected.split(/:+/g);

      // Subdividimos los argumentos en más arrays
      for (let i = 0; i < args.length; i++) {
        args[i] = [...args[i].split(/&+/g)];
      }

      // Declaramos la opción como el argumento [0][0]
      const opcion = args[0][0]

      // Si la opción es log...
      if (opcion == "log") {
        try {
          var users = [];
          client.channels.resolve(member.voice.channel.id).members.forEach((member) => {
            users.push({
              inline: true,
              name: `${member.permissions.has(PermissionFlagsBits.MuteMembers)
                ? member.permissions.has(PermissionFlagsBits.ManageGuild)
                  ? `${emojis.admin}`
                  : `${emojis.mod}`
                : ""
                } ${member.user.username}#${member.user.discriminator}`,
              value: `\`${member.id}\`\n${member.voice.mute
                ? `${member.voice.serverMute
                  ? `${emojis.serverMuted} \`SERVER MUTED\``
                  : `${emojis.selfMuted} \`SELF MUTED\``
                }`
                : `${emojis.unmute} \`UNMUTED\``
                }\n${member.voice.deaf
                  ? `${member.voice.serverDeaf
                    ? `${emojis.serverDeafen} \`SERVER DEAFENED\``
                    : `${emojis.selfDeafen} \`SELF DEAFENED\``
                  } `
                  : `${emojis.undeafen} \`UNDEAFENED\``
                }\n\n** **`,
            });
          });
          toreply.embed = new EmbedBuilder()
            .setTitle("Registro")
            .setDescription(`${users.length} ${users.length==1?"usuario registrado":"usuarios registrados"}\n\n** **`)
            .setFields(users)
            .setColor("#313131");
          toreply.ephemeral = false;

        } catch (err) {
          client.sendError(client, err)
        }
      }

      // Si la opción es mute...
      else if (opcion == "mute") {
        if (
          !interaction.member.voice.channel ||
          `${interaction.member.voice.channel.id}` !=
          `${member.voice.channel.id}`
        ) {
          error.embed = new EmbedBuilder()
            .setDescription(
              `Debes estar conectad@ al canal de voz para poder usar esta opción.`
            )
            .setColor("#fb6444");
        } else {
          try {
            client.channels
              .resolve(member.voice.channel.id)
              .members.forEach((user) => {
                if (
                  (args[1].includes(user.id) || args[1].includes("ALL")) &&
                  user.id != interaction.member.id &&
                  !user.permissions.has(PermissionFlagsBits.MuteMembers) &&
                  ((!user.voice.serverMute && args[2][0] == "true") ||
                    (user.voice.serverMute && args[2][0] == "false"))
                ) {
                  try {
                    user.voice.setMute(
                      args[2][0] == "true",
                      `El usuario ${interaction.member.id
                      } ha ejecutado una solicitud de ${args[2][0] == "true" ? "un" : ""
                      }mute en el canal ${user.voice.channel.id}`
                    );
                  } catch (err) {
                    client.sendError(client, err)
                  }
                }
              });
          } catch (err) {
            client.sendError(client, err)
          }
        }
      }

      // Si laopción es move...
      else if (opcion == "move") {
        if (!interaction.member.voice.channel) {
          error.embed = new EmbedBuilder()
            .setDescription(
              `Debes estar conectad@ a un canal de voz para poder usar esta opción.`
            )
            .setColor("#fb6444");
        } else if (args[1][0] == "US") {
          try {
            if (!client.channels.cache.get(args[2][0])) {
              error.embed = new EmbedBuilder()
                .setDescription("No se ha encontrado el canal en el servidor\n¿El bot puede verlo?")
                .setColor("#fb6444");
            } else {
              member.voice.setChannel(args[2][0], `El usuario ${interaction.member.id} ha ejecutado una solicitud de traslado al canal ${args[2][0]}`)
                .catch(() => {
                  error.embed = new EmbedBuilder()
                    .setDescription(`Algo ha impedido a Catto mover al usuario <@${member.id}>`)
                    .setColor("#fb6444");
                })

              interaction.member.voice
                .setChannel(args[2][0], `El usuario ${interaction.member.id} ha ejecutado una solicitud de traslado al canal ${args[2][0]}`)
                .catch((m) => {
                  error.embed = new EmbedBuilder()
                    .setDescription(`Algo ha impedido a Catto mover al usuario <@${interaction.member.id}>`)
                    .setColor("#fb6444");
                });
            }
          } catch (err) {
            client.sendError(client, err)
          }
        } else {
          try {
            let tempmember = interaction.guild.members.cache.get(args[1][0]);
            let tempchannel = args[2][0];
            if (!client.channels.cache.get(tempchannel))
              tempchannel = interaction.guild.members.cache.get(args[2][0])
                .voice.channel.id;
            tempmember.voice.setChannel(
              tempchannel,
              `El usuario ${interaction.member.id} ha ejecutado una solicitud de traslado al canal ${tempchannel}`
            );
          } catch (err) {
            client.sendError(client, err)
          }
        }
      }

      // Si la opción es kick...
      else if (opcion == "kick") {
        try {
          client.channels
            .resolve(member.voice.channel.id)
            .members.forEach((user) => {
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
                  client.sendError(client, err)
                }
              }
            });
        } catch (err) {
          client.sendError(client, err)
        }
      }
    }

    // Indicamos que en 1,5 segundos el cuadro debe ser actualizado
    setTimeout(async function () {
      try {
        var users = [];
        const embed = new EmbedBuilder();

        if (!member.voice.channel) {
          embed
            .setDescription("El usuario no se encuentra en ningún canal de voz")
            .setColor("#fb6444");
        } else {

          client.channels
            .resolve(member.voice.channel.id)
            .members.forEach((user) => {
              users.push(
                `${user.voice.mute
                  ? `${user.voice.serverMute
                    ? emojis.serverMuted
                    : emojis.selfMuted
                  }`
                  : emojis.unmute
                }${user.voice.deaf
                  ? `${user.voice.serverDeaf
                    ? emojis.serverDeafen
                    : emojis.selfDeafen
                  } `
                  : emojis.undeafen
                } <@${user.id}> ${user.permissions.has(PermissionFlagsBits.MuteMembers)
                  ? `${user.permissions.has(PermissionFlagsBits.ManageGuild)
                    ? `${emojis.admin}`
                    : `${emojis.mod}`
                  }`
                  : ""
                }`
              );
            });
          embed
            .setDescription(
              `**<@${member.id}> se encuentra en <#${member.voice.channel.id
              }>**\n\n${users.length > 0
                ? users.slice(0, 25).join("\n")
                : "🦗 \\**Silencio\\**\nNo hay nadie en el canal"
              }`
            )
            .setColor("#313131");
          if (users.length > 25)
            embed.setFooter({
              text: "NO SE HA LOGRADO MOSTRAR A TODOS LOS USUARIOS",
            });
        }

        const row = new ActionRowBuilder();
        require(".").build(interaction, row, users.length < 1, [member.id]);
        const boton = new ActionRowBuilder();
        require("../../Button/refreshVCUser").build(interaction, boton, false, [
          member.id,
        ]);

        await interaction.update({ embeds: [embed], components: [row, boton] });
      } catch (err) {
        client.sendError(client, err)
      }

      if (error.embed) {
        try {
          await interaction.reply({
            ephemeral: error.ephemeral,
            embeds: [error.embed],
          });
        } catch {
          try {
            await interaction.followUp({
              ephemeral: error.ephemeral,
              embeds: [error.embed],
            });
          } catch (err) {
            client.sendError(client, err)
          }
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
            await interaction.followUp({
              ephemeral: toreply.ephemeral,
              embeds: [toreply.embed],
            });
          } catch (err) {
            client.sendError(client, err)
          }
        }
      }
    }, 1500);
  },
};
