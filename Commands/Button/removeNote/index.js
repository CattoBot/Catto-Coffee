const { EmbedBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, ActionRowBuilder } = require("discord.js");
const connection = require("../../../Database/database");
const util = require("util");

module.exports = {
    build: async (interaction, actionRowBuilder, disabled, label, emoji, options) => {
        actionRowBuilder.addComponents(
            new ButtonBuilder()
                .setCustomId(`removeNote_u${interaction.member.id}_${options.join(",")}`)
                .setLabel(emoji ? " " : label)
                .setDisabled(disabled)
                .setStyle(ButtonStyle.Danger)
                .setEmoji(emoji)
        );
    },

    run: async (client, interaction) => {
        try {

            const customIDsplitted = interaction.customId.split(/_+/g);
            const miembro = interaction.member;
            const noteID = customIDsplitted[2].split(/,+/g)[0];
            const guildId = interaction.guild.id;

            // Obtenemos un array con las notas de ese servidor con esa ID
            const query = util.promisify(connection.query).bind(connection);
            const result = await query(
                `SELECT * FROM userNotes WHERE noteID = '${noteID}' AND guildID='${guildId}'`
            );

            // Si no existe ninguna, se lo indicamos al usuario
            if (result.length == 0) {
                const embed = new EmbedBuilder()
                    .setDescription("Parece que esta nota no existe en el servidor...\n¿La habrá eliminado alguien?")
                    .setColor("#ed4245")
                await interaction.reply({ embeds: [embed], ephemeral: true })
            }

            // Si el usuario es el autor o tiene permisos de gestión de roles, puede eliminar la nota
            else if (`${interaction.member.id}` == `${result[0].perpetrator}` || miembro.permissions.has(PermissionFlagsBits.ManageGuild)) {
                query(`DELETE FROM userNotes WHERE noteID = '${noteID}' AND guildID = '${guildId}'`, async (err) => {
                    // Si ocurre algún problema devuelve error
                    if (err) {
                        client.sendEmbed(
                            interaction,
                            "Ha surgido un error inesperado y no ha sido posible eliminar la nota.\nVuelva a intentarlo en unos instantes.",
                            "#ed4245"
                        );
                        return client.sendError(client, err);
                    }

                    await interaction.update({components: []})

                    // Si se logró editar la nota, se envía un mensaje de éxito
                    await interaction.followUp({
                        embeds: [
                            new EmbedBuilder()
                                .setDescription(`Nota \`#${noteID}\` eliminada exitosamente`)
                                .setTimestamp()
                                .setColor("#2b2d31")
                        ],
                        ephemeral: true
                    }).catch((e)=>{client.sendError(client, e)}).then((m)=>{
                        setTimeout(function(){
                            try{m.delete().catch(()=>{})}catch{}
                        }, 5000)
                    })

                    // Obtiene un array con un objeto que contiene los canales de configuración del servidor
                    const channelConfig = await query(
                        `SELECT * FROM configChannels WHERE guildID = '${guildId}'`
                    );

                    // Comprueba que existe la configuración y corresponde a un canal
                    if (
                        channelConfig.length > 0 &&
                        channelConfig[0].noteslogs &&
                        !isNaN(channelConfig[0].noteslogs)
                    ) {
                        try {
                            // Declara el usuario y envía un mensaje de log de que se ha eliminado la nota
                            const user = await client.users.fetch(result[0].userID);
                            client.channels
                                .resolve(channelConfig[0].noteslogs)
                                .send({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setColor("#ed4245")
                                            .setAuthor({
                                                name:
                                                    interaction.member.user.username +
                                                    "#" +
                                                    interaction.member.user.discriminator,
                                                iconURL: interaction.member.user.avatarURL(),
                                            })
                                            .setDescription(
                                                `**Miembro:** ${user.username}#${user.discriminator} (${user.id})\n**Acción:** Eliminar nota \`#${noteID}\``
                                            )
                                            .setTimestamp(),
                                    ],

                                    // De darse un error, lo devuelve
                                })
                                .catch((e) => {
                                    client.sendError(client, e);
                                });
                        } catch (e) {
                            client.sendError(client, e);
                        }
                    }

                })
            }

            // Si no, el bot devolverá error
            else {
                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription("No dispones de los permisos necesarios para eliminar esta nota.\nSólo el autor/a y usuarios con permisos de gestión del servidor pueden.")
                            .setColor("#ed4245")
                    ],
                    ephemeral: true
                })
            }

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
