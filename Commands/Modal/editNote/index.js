const {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  PermissionFlagsBits,
  TextInputBuilder,
  ModalBuilder,
} = require("discord.js");
const connection = require("../../../Database/database");
const util = require("util");

module.exports = {
  build: async (interaction, noteID) => {
    const modal = new ModalBuilder()
      .setCustomId(`editNote_${noteID}`)
      .setTitle("Edita una nota");

    const textInput = new TextInputBuilder()
      .setCustomId("text")
      .setLabel("Nuevo texto")
      .setStyle("Paragraph")
      .setRequired(true)
      .setMaxLength(1800);

    const text = new ActionRowBuilder().addComponents(textInput);
    modal.addComponents(text);
    await interaction.showModal(modal);
  },

  run: async (client, interaction) => {
    try {
      await interaction.deferReply({ ephemeral: true });

      const customIDsplitted = interaction.customId.split(/_+/g);
      const miembro = interaction.member;
      const noteID = customIDsplitted[1];
      const guildId = interaction.guild.id;
      const text = interaction.fields.getTextInputValue("text");

      // Obtenemos un array con las notas del servidor que tienen esa ID
      const query = util.promisify(connection.query).bind(connection);
      const result = await query(
        `SELECT * FROM userNotes WHERE noteID=${noteID} AND guildID='${guildId}'`
      );

      // Si el resultado está vacío, mostrará un error
      if (result.length == 0) {
        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor("#ed4245")
              .setDescription(
                "Parece ser que esta nota ya no existe...\n¿La habrá eliminado alguien?"
              ),
          ],
        });
      }

      // Volvemos a comprobar si el usuario tiene permisos
      else if (
        `${result[0].perpetrator}` == `${interaction.member.id}` ||
        miembro.permissions.has(PermissionFlagsBits.ManageRoles)
      ) {
        // Actualiza la información de la nota
        connection.query(
          `UPDATE userNotes SET note='${text}' WHERE noteID=${noteID}`,
          async (err) => {
            // SI ocurre algún error, informa de ello
            if (err) {
              await interaction.editReply({ content: "ERROR", content: [] });
              client.sendError(client, err);
            }

            // Si todo va bien, muestra un mensaje de éxito
            await interaction.editReply({
              embeds: [
                new EmbedBuilder()
                  .setColor("#5865f2")
                  .setDescription(
                    "La nota `#" + noteID + "` ha sido modificada exitosamente"
                  ),
              ],
            });

            // Obtenemos los canales de configuración del servidor
            const channelConfig = await query(
              `SELECT * FROM configChannels WHERE guildID = '${guildId}'`
            );

            // Si hay un canal de logs de notas, envía un mensaje de log en él
            if (
              channelConfig.length > 0 &&
              channelConfig[0].noteslogs &&
              !isNaN(channelConfig[0].noteslogs)
            ) {
              try {
                const user = await client.users.fetch(result[0].userID);
                client.channels
                  .resolve(channelConfig[0].noteslogs)
                  .send({
                    embeds: [
                      new EmbedBuilder()
                        .setColor("#fee528")
                        .setAuthor({
                          name:
                            interaction.member.user.username +
                            "#" +
                            interaction.member.user.discriminator,
                          iconURL: interaction.member.user.avatarURL(),
                        })
                        .setDescription(
                          `**Miembro:** ${user.username}#${
                            user.discriminator
                          } (${user.id})\n**Acción:** Editar nota${
                            isNaN(result[0].readRoleID)
                              ? ""
                              : `\n**Restricciones:** <@&${result[0].readRoleID}>`
                          }\n**Ahora:** ${
                            isNaN(result[0].readRoleID)
                              ? text
                              : "*Nota protegida*"
                          }`
                        )
                        .setTimestamp()
                        .setFooter({ text: `Nota #${noteID}` }),
                    ],
                  })
                  .catch((e) => {
                    console.log(e);
                  });
              } catch (err) {
                client.sendError(client, err);
              }
            }
          }
        );
      }

      // Si el usuario no posee permisos, envía un mensaje de error
      else {
        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor("#ed4245")
              .setDescription(
                "Ya no posees los permisos necesarios para ejecutar esta acción"
              ),
          ],
        });
      }
    } catch (err) {
      client.sendError(client, err);
      await interaction.update({
        content: "¡Error!",
        embeds: [],
        components: [],
      });
    }
  },
};
