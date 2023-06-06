const connection = require("../../../../../../Database/database");
const {
  CommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
} = require("discord.js");
const util = require("util");
const { Bot } = require("../../../../../../handlers/Client");

// CONSTRUCTOR DE COMANDOS
const { subcommandBuilder } = require("../../../../../../handlers/classes");
const command = new subcommandBuilder({
  name: "list",
  description: `View the notes of a user`,

  // Especificamos los valores que tomará "description" en determinados idiomas
  description_localizations: {
    "es-ES": "Visualiza las notas de un usuario",
    "pt-BR": "Visualize as notas de um usuário",
  },
  userPermissions: PermissionFlagsBits.ManageMessages,
  botPermissions: PermissionFlagsBits.SendMessages,
  cooldown: 10,
  options: [
    {
      name: "user",

      // Especificamos los valores que tomará "name" en determinados idiomas
      name_localizations: {
        "es-ES": "usuario",
        "pt-BR": "usuário",
      },
      description: "Which user do you want to see notes from?",

      // Especificamos los valores que tomará "description" en determinados idiomas
      description_localizations: {
        "es-ES": "¿De qué usuario quieres ver las notas?",
        "pt-BR": "De qual usuário você deseja ver as notas?",
      },
      type: 6,
      required: true,
    },
  ],
});

module.exports = {
  // Exportamos el constructor del comando
  command: command,
  /**
   *
   * @param {Bot} client
   * @param {CommandInteraction} interaction
   */
  run: async (client, interaction) => {
    await interaction.deferReply();
    try {
      // Obtenemos los usuarios y la ID del servidor
      const miembro = interaction.member;
      const user = interaction.options.getUser("user");
      const guildId = interaction.guild.id;

      // Verificar si el usuario tiene el permiso MANAGE_MESSAGES en el servidor
      if (!miembro.permissions.has(PermissionFlagsBits.ManageMessages)) {
        return client.sendEmbed(
          interaction,
          "No tienes permisos para ejecutar este comando."
        );
      }

      // Hacemos una consulta para obtener las notas que le pertenecen al usuario
      const query = util.promisify(connection.query).bind(connection);
      const result = await query(
        `SELECT * FROM userNotes WHERE userID = '${user.id}' AND guildID = '${guildId}'`
      );

      // Creamos una fila de componentes para insertar botones
      const row = new ActionRowBuilder();

      // Si no hay ninguna nota
      if (result.length === 0)
        return client.sendEmbed(
          interaction,
          "No hay ninguna nota de este usuario",
          "#ed4245"
        );

      // Si hay una o más notas
      let fields = [];

      // Agarramos las 5 primeras, las que irán en la 1ª página
      result.slice(0, 5).forEach((nota) => {
        // Si la nota es pública o el usuario tiene permisos para verla, se mostrará en la lista de notas del usuario
        if (
          nota.readRoleID == "PUBLIC" ||
          interaction.member.roles.cache.find(
            (r) => `${r.id}` == nota.readRoleID
          )
        ) {
          // Como el caracterer ' es substituído por %39% para evitar conflicto, deshacemos el cambio
          let text = nota.note.replace(/%39%+/g, "'");

          // Si el texto es muy largo, lo acortamos
          if (text.length > 250)
            text =
              text.substring(0, 197) +
              ` \`[...]\`\n**\`${Math.floor(
                text.length - 197
              )} caracteres restantes\`**`;

          // Intentamos declarar una a una todas las notas y si alguna falla, devolvemos error
          try {
            fields.push({
              name: `Nota #${nota.noteID} ${
                nota.readRoleID == "PUBLIC" ? "" : "`(PRIVADA)`"
              } ${
                nota.attachmenturl == "BLANK"
                  ? ""
                  : "<:attachment:1098012443231396033>"
              }`,
              value: `${nota.readRoleID == "PUBLIC" ? text : "** **"}`,
            });
          } catch (err) {
            client.sendError(
              client,
              err,
              `Nota #${nota.noteID} del server ${note.guildID}`
            );
          }
        }
      });

      // Ahora intentamos procesar los datos y devolverlos, y si falla, devolvemos error
      try {
        // Calculamos el número de páginas que serán necesarias para mostrar las notas de 5 en 5
        var pages = Math.floor(result.length / 5);

        // Si una página no está completa, la contamos igual
        if (result.length % 5 != 0) pages++;

        // Construímos los botones en la fila de componentes
        require("../../../../../Button/notesPage").build(
          interaction,
          row,
          true,
          undefined,
          "⬅️",
          [1, 0, user.id]
        );
        require("../../../../../Button/clearNotes").build(
          interaction,
          row,
          result.length == 0,
          "Limpiar",
          "🗑️",
          [user.id]
        );
        require("../../../../../Button/notesPage").build(
          interaction,
          row,
          pages <= 1,
          undefined,
          "➡️",
          [1, 1, user.id]
        );

        // Devolvemos como respuesta el embed con las notas y la fila de botones

        if (interaction.deferred) {
          await interaction
            .editReply({
              embeds: [
                new EmbedBuilder()
                  .setColor("#2b2d31")
                  .setTitle("REPOSITORIO DE NOTAS")
                  .setAuthor({
                    name: user.username + "#" + user.discriminator,
                    iconURL: user.avatarURL(),
                  })
                  .setFooter({
                    text: `${result.length}/15 notas${
                      pages > 1 ? ` | Página 1/${pages}` : ""
                    }`,
                  })
                  .setFields(fields),
              ],
              components: [row],
            })
            .catch((err) => {
              // Y si falla, devolvemos error
              client.sendError(client, err);
            });
        } else {
          await interaction
            .reply({
              embeds: [
                new EmbedBuilder()
                  .setColor("#2b2d31")
                  .setTitle("REPOSITORIO DE NOTAS")
                  .setAuthor({
                    name: user.username + "#" + user.discriminator,
                    iconURL: user.avatarURL(),
                  })
                  .setFooter({
                    text: `${result.length}/15 notas${
                      pages > 1 ? ` | Página 1/${pages}` : ""
                    }`,
                  })
                  .setFields(fields),
              ],
              components: [row],
            })
            .catch((err) => {
              // Y si falla, devolvemos error
              client.sendError(client, err);
            });
        }
      } catch (err) {
        client.sendError(client, err, "Error enviando el mensaje");
        return client.sendEmbed(
          interaction,
          `Parece que ha ocurrido un error.\nPor favor, si el error persiste contacte con uno de los desarrolladores`
        );
      }
    } catch (err) {
      client.sendError(client, err, "Error en el comando MOD NOTES LIST");
      return client.sendEmbed(
        interaction,
        `Parece que ha ocurrido un error.\nPor favor, si el error persiste contacte con uno de los desarrolladores`
      );
    }
  },
};
