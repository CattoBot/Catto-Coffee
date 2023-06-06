const { EmbedBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, ActionRowBuilder } = require("discord.js");
const connection = require("../../../Database/database");
const util = require("util");

module.exports = {
    build: async (interaction, actionRowBuilder, disabled, label, emoji, options) => {
        actionRowBuilder.addComponents(
            new ButtonBuilder()
                .setCustomId(`notesPage_u${interaction.member.id}_${options.join(",")}`)
                .setLabel(emoji ? " " : label)
                .setDisabled(disabled)
                .setStyle(ButtonStyle.Secondary)
                .setEmoji(emoji)
        );
    },

    run: async (client, interaction) => {
        try {

            const customIDsplitted = interaction.customId.split(/_+/g);
            const miembro = interaction.member;
            const member = interaction.guild.members.cache.get(customIDsplitted[2].split(/,+/g)[2]);
            const guildId = interaction.guild.id;
            const actualPage = parseInt(customIDsplitted[2].split(/,+/g)[0]); // Página actual
            const movement = parseInt(customIDsplitted[2].split(/,+/g)[1]); // Nº de páginas que debemos movernos

            // Verificar si el usuario tiene el permiso MANAGE_MESSAGES en el servidor
            if (!miembro.permissions.has(PermissionFlagsBits.ManageMessages)) {
                return await interaction.update({
                    components: [], embeds: [
                        new EmbedBuilder()
                            .setColor("#ed4245")
                            .setDescription("Has perdido los permisos para usar este comando")
                    ]
                })
            }

            // Obtenemos las notas que el usuario tiene en el servidor
            const query = util.promisify(connection.query).bind(connection);
            const result = await query(
                `SELECT * FROM userNotes WHERE userID = '${member.id}' AND guildID='${guildId}'`
            );

            // Declaramos un embed base
            const embed = new EmbedBuilder()
                .setColor("#2b2d31")
                .setTitle("REPOSITORIO DE NOTAS")
                .setAuthor({ name: member.user.username + "#" + member.user.discriminator, iconURL: member.user.avatarURL() })

            // Declaramos una fila de componentes
            const row = new ActionRowBuilder()

            // Si el array de notas que coinciden no tiene elementos, indicamos en el embed que el usuario no tiene notas
            if (result.length === 0) {
                embed.setDescription("No hay ninguna nota de este usuario")
            }

            // De lo contrario, montaremos los resultados en este embed
            else {

                // Declaramos una variable que contendrá los campos del embed
                let fields = []

                // Seleccionamos las 5 notas de la página correspondiente
                result.slice(5 * (actualPage - 1 + movement), 5 * (actualPage + movement)).forEach((nota) => {

                    try {

                        // Si la nota es pública o el usuario tiene permisos para verla, se mostrará en la lista de notas del usuario
                        if (nota.readRoleID == "PUBLIC" || interaction.member.roles.cache.find(r => `${r.id}` == nota.readRoleID)) {

                            // Como el caracterer ' es substituído por %39% para evitar conflicto, deshacemos el cambio
                            let text = nota.note.replace(/%39%+/g, "'")

                            // Si el texto es muy largo, lo acortamos
                            if (text.length > 250) text = text.substring(0, 197) + ` \`[...]\`\n**\`${Math.floor(text.length - 197)} caracteres restantes\`**`

                            // Intentamos declarar una a una todas las notas y si alguna falla, devolvemos error
                            try {
                                fields.push(
                                    {
                                        name: `Nota #${nota.noteID} ${nota.readRoleID == "PUBLIC" ? "" : "`(PRIVADA)`"} ${nota.attachmenturl == "BLANK" ? "" : "<:attachment:1098012443231396033>"}`,
                                        value: `${nota.readRoleID == "PUBLIC" ? text : "** **"}`
                                    }
                                )
                            } catch (err) {
                                client.sendError(client, err, `Nota #${nota.noteID} del server ${note.guildID}`)
                            }
                        }

                    } catch (err) { client.sendError(client, err, `Nota #${nota.noteID} del server ${note.guildID}`) }
                });

                // Contamos la cantidad de items mostrados, calculamos el número de páginas necesarias para mostrarlos y mostramos esta información en el embed
                let ammount = result.filter(e => e.guildID == guildId).length
                let pages = Math.floor(ammount / 5)
                if (ammount % 5 != 0) pages++ // Aunque la página no esté completa, cuenta
                embed
                    .setFooter({ text: `${ammount}/15 notas${pages > 1 ? ` | Página ${actualPage + movement}/${pages}` : ""}` })
                    .setFields(fields)

                // Añadimos los botones de atrás y adelante
                require(".").build(interaction, row, (actualPage + movement) == 1, undefined, "⬅️", [actualPage + movement, -1, member.id])
                require(".").build(interaction, row, (actualPage + movement) == pages, undefined, "➡️", [actualPage + movement, 1, member.id])
            }

            // Actualizamos la respuesta
            await interaction.update({ embeds: [embed], components: [row] }).catch((err) => { console.log(err) })

        } catch (err) {
            client.sendError(client, err)
            await interaction.update({
                content: "¡Error!",
                embeds: [],
                components: [],
            });
        }
    },
};
