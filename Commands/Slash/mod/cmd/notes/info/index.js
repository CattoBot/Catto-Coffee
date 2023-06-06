const connection = require("../../../../../../Database/database");
const {
  CommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
} = require("discord.js");
const util = require("util");
const { Bot } = require("../../../../../../handlers/Client");

const { subcommandBuilder } = require("../../../../../../handlers/classes");
const command = new subcommandBuilder({
  name: "info",
  description: `Get detailed information about a note`,
  description_localizations: {
    "es-ES": "Obtén información detallada acerca de una nota",
    "pt-BR": "Obter informações detalhadas sobre uma nota",
  },
  userPermissions: PermissionFlagsBits.ManageMessages,
  botPermissions: PermissionFlagsBits.SendMessages,
  cooldown: 10,
  options: [
    {
      name: "id",
      name_localizations: {
        "es-ES": "id",
        "pt-BR": "id",
      },
      description: "Note ID",
      description_localizations: {
        "es-ES": "ID de la nota",
        "pt-BR": "ID da nota",
      },
      type: 4,
      required: true,
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
    await interaction.deferReply();
    try {
      // Declaramos el usuario, la ID de la nota y la ID del servidor
      const miembro = interaction.member;
      const noteID = interaction.options.getInteger("id");
      const guildId = interaction.guild.id;

      // Verificar si el usuario tiene el permiso MANAGE_MESSAGES en el servidor
      if (!miembro.permissions.has(PermissionFlagsBits.ManageMessages)) {
        return client.sendEmbed(
          interaction,
          "No tienes permisos para ejecutar este comando."
        );
      }

      // Obtenemos un array con todas las notas de ese servidor que coincidan en ID
      const query = util.promisify(connection.query).bind(connection);
      const result = await query(
        `SELECT * FROM userNotes WHERE noteID = ${noteID} AND guildID = '${guildId}'`
      );

      // Si no existe ninguna nota que coincida, devolvemos error
      if (result.length === 0)
        return client.sendEmbed(
          interaction,
          "Parece ser que esta nota no existe",
          "#ed4245"
        );

      // Declaramos que la nota que queremos, es la primera (Y esperemos que única) del array de notas que coinciden
      const nota = result[0];

      // Declaramos quiénes son los que la crearon y sufrieron
      const perpetrator = await client.users.fetch(nota.perpetrator);
      const user = await client.users.fetch(nota.userID);

      // Declaramos un embed para ser enviado con la información
      const embed = new EmbedBuilder();

      // Declaramos una variable booleana que impedirá que se monten los botones de editar si hubo un error
      var error = false;

      try {
        // Modificamos el embed para añadirle la información referente a la nota
        embed
          .setAuthor({
            name: perpetrator.username + "#" + perpetrator.discriminator,
            iconURL: perpetrator.avatarURL(),
          })
          .setDescription(
            `**Miembro:** ${
              user
                ? `${user.username + "#" + user.discriminator} (${nota.userID})`
                : `${nota.userID}`
            }${
              isNaN(nota.readRoleID)
                ? ""
                : `\n**Restricciones:** <@&${nota.readRoleID}>`
            }\n**Nota:** ${
              nota.readRoleID == "PUBLIC"
                ? nota.note.replace(/%39%+/g, "'").substring(0, 1800)
                : "*Nota protegida*"
            }`
          )
          .setFooter({ text: `Nota #${noteID}` })
          .setTimestamp(parseInt(nota.unix))
          .setColor("#2b2d31");
      } catch (err) {
        // Si algo falla, declaramos error como true y modificamos el embed para que muestre un error
        error = true;
        embed
          .setColor("#ed4245")
          .setDescription("Ha ocurrido un error de visualiación de la nota");

        // Acto seguido, enviamos un error como respuesta
        client.sendError(client, err);
      }

      // Creamos una nueva fila de botones
      const row = new ActionRowBuilder();

      // Si la nota no es pública, constamos en la fila de botones un nuevo botón "Revelar"
      if (nota.readRoleID != "PUBLIC")
        require("../../../../../Button/revealNote").build(
          interaction,
          row,
          false,
          "Revelar",
          "🔓",
          [noteID]
        );

      var embeds = [];

      // Si la nota no está protegida y tiene media, la muestra
      if (nota.attachmenturl != "BLANK" && isNaN(nota.readRoleID)) {
        nota.attachmenturl.split(/;+/g).forEach((at) => {
          if (
            at.endsWith(".png") ||
            at.endsWith(".jpg") ||
            at.endsWith(".jpeg") ||
            at.endsWith(".gif")
          ) {
            embeds.push(new EmbedBuilder().setImage(at).setColor("#2b2d31"));
          } else {
            embeds.push(
              new EmbedBuilder()
                .setDescription(
                  `**Nombre:** ${
                    at.split(/\/+/g)[at.split(/\/+/g).length - 1]
                  }\n**Link de descarga:** [Haga click aquí](${at})`
                )
                .setColor("#2b2d31")
            );
          }
        });
      }

      // Añade un botón de editar a la fila de componentes
      require("../../../../../Button/editNote").build(
        interaction,
        row,
        result.length == 0 || error,
        "Editar",
        "✏️",
        [noteID]
      );

      require("../../../../../Button/removeNote").build(
        interaction,
        row,
        result.length == 0 || error,
        "Eliminar",
        "🗑️",
        [noteID]
      );

      // Intenta enviar el mensaje y de no lograrlo, devuelve error
      if (interaction.deferred) {
        await interaction
          .editReply({ embeds: [embed, ...embeds], components: [row] })
          .catch((err) => {
            client.sendError(client, err);
          });
      } else {
        await interaction
          .reply({ embeds: [embed, ...embeds], components: [row] })
          .catch((err) => {
            client.sendError(client, err);
          });
      }
    } catch (err) {
      client.sendError(client, err);
      return client.sendEmbed(
        interaction,
        `Parece que ha ocurrido un error.\nPor favor, si el error persiste contacte con uno de los desarrolladores`,
        "#ed4245"
      );
    }
  },
};