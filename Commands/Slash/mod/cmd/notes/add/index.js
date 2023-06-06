const connection = require("../../../../../../Database/database");
const {
  CommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const util = require("util");
const { Bot } = require("../../../../../../handlers/Client");
const query = util.promisify(connection.query).bind(connection);

const { subcommandBuilder } = require("../../../../../../handlers/classes");
const command = new subcommandBuilder({
  name: "add",
  description: `Add a note to a user`,
  description_localizations: {
    "es-ES": "Añade una nota a un usuario",
    "pt-BR": "Adicione uma nota a um usuário",
  },
  userPermissions: PermissionFlagsBits.ManageMessages,
  botPermissions: PermissionFlagsBits.SendMessages,
  cooldown: 10,
  options: [
    {
      name: "user",
      name_localizations: {
        "es-ES": "usuario",
        "pt-BR": "usuário",
      },
      description: "User to add the note to",
      description_localizations: {
        "es-ES": "Usuario al que añadir la nota",
        "pt-BR": "Usuário para adicionar a nota",
      },
      type: 6,
      required: true,
    },
    {
      name: "note",
      name_localizations: {
        "es-ES": "nota",
        "pt-BR": "nota",
      },
      description: "What is the text you want to attach?",
      description_localizations: {
        "es-ES": "¿Cuál es el texto que quieres adjuntar?",
        "pt-BR": "Qual é o texto que você deseja anexar?",
      },
      type: 3,
      required: true,
    },
    {
      name: "restriction",
      name_localizations: {
        "es-ES": "restricciones",
        "pt-BR": "restrições",
      },
      description: "Do you want to restrict which role can see this note?",
      description_localizations: {
        "es-ES": "¿Quieres restringir qué rol puede ver esta nota?",
        "pt-BR": "Deseja restringir qual rol pode ver esta nota?",
      },
      type: 8,
      required: false,
    },
    {
      name: "attachment1",
      name_localizations: {
        "es-ES": "adjunto1",
        "pt-BR": "anexo1",
      },
      description: "Do you have a file to attach about it?",
      description_localizations: {
        "es-ES": "¿Tienes algún archivo que adjuntar al respecto?",
        "pt-BR": "Você tem algum arquivo para anexar sobre isso?",
      },
      type: 11,
      required: false,
    },
    {
      name: "attachment2",
      name_localizations: {
        "es-ES": "adjunto2",
        "pt-BR": "anexo2",
      },
      description: "Do you have a file to attach about it?",
      description_localizations: {
        "es-ES": "¿Tienes algún archivo que adjuntar al respecto?",
        "pt-BR": "Você tem algum arquivo para anexar sobre isso?",
      },
      type: 11,
      required: false,
    },
    {
      name: "attachment3",
      name_localizations: {
        "es-ES": "adjunto3",
        "pt-BR": "anexo3",
      },
      description: "Do you have a file to attach about it?",
      description_localizations: {
        "es-ES": "¿Tienes algún archivo que adjuntar al respecto?",
        "pt-BR": "Você tem algum arquivo para anexar sobre isso?",
      },
      type: 11,
      required: false,
    },
    {
      name: "attachment4",
      name_localizations: {
        "es-ES": "adjunto4",
        "pt-BR": "anexo4",
      },
      description: "Do you have a file to attach about it?",
      description_localizations: {
        "es-ES": "¿Tienes algún archivo que adjuntar al respecto?",
        "pt-BR": "Você tem algum arquivo para anexar sobre isso?",
      },
      type: 11,
      required: false,
    },
    {
      name: "attachment5",
      name_localizations: {
        "es-ES": "adjunto5",
        "pt-BR": "anexo5",
      },
      description: "Do you have a file to attach about it?",
      description_localizations: {
        "es-ES": "¿Tienes algún archivo que adjuntar al respecto?",
        "pt-BR": "Você tem algum arquivo para anexar sobre isso?",
      },
      type: 11,
      required: false,
    },
    {
      name: "attachment6",
      name_localizations: {
        "es-ES": "adjunto6",
        "pt-BR": "anexo6",
      },
      description: "Do you have a file to attach about it?",
      description_localizations: {
        "es-ES": "¿Tienes algún archivo que adjuntar al respecto?",
        "pt-BR": "Você tem algum arquivo para anexar sobre isso?",
      },
      type: 11,
      required: false,
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
    try {
      await interaction.deferReply({ ephemeral: true });

      // Obtiene los usuarios, la nota a agregar, el rol de restricción y el adjunto
      const miembro = interaction.member;
      const user = interaction.options.getUser("user");
      const nota = interaction.options.getString("note");
      const rol = interaction.options.getRole("restriction");
      const attachment1 = interaction.options.getAttachment("attachment1");
      const attachment2 = interaction.options.getAttachment("attachment2");
      const attachment3 = interaction.options.getAttachment("attachment3");
      const attachment4 = interaction.options.getAttachment("attachment4");
      const attachment5 = interaction.options.getAttachment("attachment5");
      const attachment6 = interaction.options.getAttachment("attachment6");

      const attachments = [
        attachment1,
        attachment2,
        attachment3,
        attachment4,
        attachment5,
        attachment6,
      ].filter((e) => e);

      // Declara el ID del servidor
      const guildId = interaction.guild.id;

      // Verificar si el usuario tiene el permiso MANAGE_MESSAGES en el servidor
      if (!miembro.permissions.has(PermissionFlagsBits.ManageMessages)) {
        return client.sendEmbed(
          interaction,
          "No tienes permisos para ejecutar este comando."
        );
      }

      // Si el usuario en cuestión es un bot no permite añadirle una nota
      if (user.bot)
        return client.sendEmbed(
          interaction,
          "No se pueden hacer anotaciones a un bot",
          "#ed4245"
        );

      // Obtiene un array con las notas del usuario en el servidor
      const query = util.promisify(connection.query).bind(connection);
      const result = await query(
        `SELECT * FROM userNotes WHERE userID = '${user.id}' AND guildID = '${interaction.guild.id}'`
      );

      // Si el usuario dispone de más de 15 notas no se le permite al staff agregar más notas
      if (result.length >= 15)
        return client.sendEmbed(
          interaction,
          "Se ha logrado el máximo de notas que se le pueden añadir a este usuario en el servidor.",
          "#ed4245"
        );

      // Obtiene un array con las notas del servidor
      const guildNotes = await query(
        `SELECT * FROM userNotes WHERE guildID = '${interaction.guild.id}'`
      );

      // Revisa las IDs de notas empleadas en el servidor y las coloca por orden
      const sorted = guildNotes.sort(function (a, b) {
        if (a.noteID < b.noteID) return -1;
        if (a.noteID > b.noteID) return 1;
        return 0;
      });

      // Si no hay notas previas, la ID de la nueva nota será 1
      var noteID = 1;

      // Si hay notas previas, la ID será la siguiente a la ID de la última
      if (guildNotes.length > 0)
        noteID = Math.floor(parseInt(sorted[sorted.length - 1].noteID) + 1);

      // Declaramos un embed base para enviar
      const embed = new EmbedBuilder().setColor("2b2d31");

      // Hacemos una conexión a la base de datos solicitando introducir la nueva nota con todos sus datos
      await query(
        `INSERT INTO userNotes (noteID, userID, guildID, perpetrator, unix, note, readRoleID, attachmenturl) VALUES ( ${noteID} ,'${
          user.id
        }', '${guildId}', '${interaction.member.id}', ${Date.now()}, '${nota
          .replace(/'+/g, "%39%")
          .replace(/\\+/g, "\\\\")}', '${rol ? rol.id : "PUBLIC"}', 'BLANK')`,
        async (err) => {
          // Si se produjo un error devolverá error
          if (err) {
            embed
              .setDescription(
                "Se ha producido un error y no ha sido posible añadir la nota"
              )
              .setColor("#ed4245");
            return client.sendError(client, err);
          }

          // Obtiene un array con un objeto con los canales de configuración del servidor
          const configChannels = await query(
            `SELECT * FROM configChannels WHERE guildID = '${guildId}'`
          );

          // Si existe al menos un objeto en los canales de configuración y tiene una ID registrada en el campo de canal de logs de notas envía el log
          if (
            configChannels.length > 0 &&
            configChannels[0].noteslogs &&
            !isNaN(configChannels[0].noteslogs)
          ) {
            try {
              var size = 0;
              if (attachments.length > 0)
                attachments.forEach((attachment) => {
                  size += attachment.size;
                });

              // Si el usuario añadió un grupo de adjuntos de menos de 25MB
              if (size > 0 && size < 25000000) {
                // Declara sended como true, suponiendo que todo va a salir bien
                var sended = true;

                // Declara el pié del embed como "Subiendo archivo"
                embed.setFooter({ text: "Subiendo adjuntos..." });

                // Crea un nuevo embed de log
                const notaEmbed = new EmbedBuilder()
                  .setTimestamp()
                  .setColor("#57f287")
                  .setAuthor({
                    name:
                      miembro.user.username + "#" + miembro.user.discriminator,
                    iconURL: miembro.user.avatarURL(),
                  })
                  .setDescription(
                    `**Miembro:** ${
                      user.username + "#" + user.discriminator
                    } (${user.id})\n**Acción:** Crear nota${
                      rol ? `\n**Restricciones:** <@&${rol.id}>` : ""
                    }\n**Nota:** ${
                      rol
                        ? "*Nota protegida*"
                        : nota.replace(/%39%+/g, "'").substring(0, 1800)
                    }`
                  )
                  .setFooter({ text: `Nota #${noteID}` })

                let attachmentsulrs = [];
                attachments.forEach((attachment) => {
                  attachmentsulrs.push(attachment.url);
                });

                // Envía el embed de log y el archivo, si falla devuelve error mientras declara sended como false
                client.channels
                  .resolve(configChannels[0].noteslogs)
                  .send({ embeds: [notaEmbed], files: attachmentsulrs })
                  .catch(async (e) => {
                    embed.setFooter({
                      text: "¿El bot tiene acceso al canal de logs de notas?",
                    });
                    await interaction
                      .editReply({ embeds: [embed] })
                      .catch(async () => {
                        return undefined;
                      });
                    client.sendError(
                      client,
                      e,
                      "Error controlado subiendo el archivo"
                    );
                    sended = false;

                    // Prepara un nuevo mensaje de log
                    const notaEmbed = new EmbedBuilder()
                      .setTimestamp()
                      .setColor("#57f287")
                      .setAuthor({
                        name:
                          miembro.user.username +
                          "#" +
                          miembro.user.discriminator,
                        iconURL: miembro.user.avatarURL(),
                      })
                      .setDescription(
                        `**Miembro:** ${
                          user.username + "#" + user.discriminator
                        } (${user.id})\n**Acción:** Crear nota${
                          rol ? `\n**Restricciones:** <@&${rol.id}>` : ""
                        }\n**Nota:** ${
                          rol
                            ? "*Nota protegida*"
                            : nota.replace(/%39%+/g, "'").substring(0, 1800)
                        }`
                      )
                      .setFooter({ text: `Nota #${noteID}` });

                    // Envía el mensaje sin ningún archivo adjunto y si hay algún error devuelve error
                    client.channels
                      .resolve(configChannels[0].noteslogs)
                      .send({ embeds: [notaEmbed] })
                      .catch(async (e) => {
                        embed.setFooter({
                          text: "¿El bot tiene acceso al canal de logs de notas?",
                        });
                        await interaction
                          .editReply({ embeds: [embed] })
                          .catch(async (e) => {
                            console.log(e);
                          });
                        client.sendError(
                          client,
                          e,
                          "Error controlado enviando el log"
                        );
                      });
                  })
                  .then(async (m) => {
                    // Una vez terminado el envío verifica si realmente ha sido enviado.
                    if (!sended) return;
                    var fileAttachments = Array.from(
                      m.attachments,
                      function (entry) {
                        return { key: entry[0], value: entry[1] };
                      }
                    );
                    for (let i = 0; i < fileAttachments.length; i++) {
                      fileAttachments[i] = fileAttachments[i].value.url;
                    }
                    await query(
                      `UPDATE userNotes SET attachmenturl='${fileAttachments.join(
                        ";"
                      )}' WHERE noteID=${noteID}`
                    );
                    embed.setFooter({ text: "¡Adjuntos cargados!" });
                    await interaction.editReply({ embeds: [embed] });
                  });
              }

              // Si el usuario añadió un adjunto de más de 8MB o no lo añadió
              else {
                // Comprueba si hay un adjunto de más de 8MB, si lo hay, informa de que no será enviado
                if (size >= 25000000)
                  embed.setFooter({
                    text: "¡Los archivos son demasiado grandes! El conjunto de ellos no puede superar los 25MB",
                  });

                // Prepara un mensaje de log
                const notaEmbed = new EmbedBuilder()
                  .setTimestamp()
                  .setColor("#57f287")
                  .setAuthor({
                    name:
                      miembro.user.username + "#" + miembro.user.discriminator,
                    iconURL: miembro.user.avatarURL(),
                  })
                  .setDescription(
                    `**Miembro:** ${
                      user.username + "#" + user.discriminator
                    } (${user.id})\n**Acción:** Crear nota${
                      rol ? `\n**Restricciones:** <@&${rol.id}>` : ""
                    }\n**Nota:** ${
                      rol
                        ? "*Nota protegida*"
                        : nota.replace(/%39%+/g, "'").substring(0, 1800)
                    }`
                  )
                  .setFooter({ text: `Nota #${noteID}` });

                // Envía el mensaje sin ningún archivo adjunto y si hay algún error devuelve error
                client.channels
                  .resolve(configChannels[0].noteslogs)
                  .send({ embeds: [notaEmbed] })
                  .catch(async (e) => {
                    embed.setFooter({
                      text: "¿El bot tiene acceso al canal de logs de notas?",
                    });
                    await interaction
                      .editReply({ embeds: [embed] })
                      .catch(async (e) => {
                        console.log(e);
                      });
                    client.sendError(
                      client,
                      e,
                      "Error controlado enviando el log"
                    );
                  });
              }
            } catch (err) {
              embed.setFooter({
                text: "Algo ha fallado. Es probable que la nota no se haya creado correctamente.",
              });
              console.log(err);
            }
          } else {
            // Si no hay canal de logs especifica
            embed.setFooter({
              text: "Para guardar los logs es necesario configurar un canal de logs de notas",
            });
          }

          // Una vez terminado todo el proceso, declara la descripción del embed a un mensaje de éxito
          embed.setDescription(
            `La nota \`#${noteID}\` ha sido creada exitosamente.`
          );

          // Envía el mensaje, y si no lo logra, devuelve error
          if (interaction.deferred) {
            await interaction.editReply({ embeds: [embed] }).catch((err) => {
              console.log(err);
            });
          } else {
            await interaction.reply({ embeds: [embed] }).catch((err) => {
              console.log(err);
            });
          }
        }
      );
    } catch (err) {
      console.log(err);
      return client.sendEmbed(
        interaction,
        `Parece que ha ocurrido un error.\nPor favor, si el error persiste contacte con uno de los desarrolladores`,
        "#ed4245"
      );
    }
  },
};