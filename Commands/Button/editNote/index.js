const { EmbedBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, ActionRowBuilder } = require("discord.js");
const connection = require("../../../Database/database");
const util = require("util");

module.exports = {
    build: async (interaction, actionRowBuilder, disabled, label, emoji, options) => {
        actionRowBuilder.addComponents(
            new ButtonBuilder()
                .setCustomId(`editNote_u${interaction.member.id}_${options.join(",")}`)
                .setLabel(emoji?" ":label)
                .setDisabled(disabled)
                .setStyle(ButtonStyle.Success)
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
                await interaction.reply({embeds: [embed], ephemeral: true})
            }
            
            // Si el usuario es el autor o tiene permisos de gestión de roles, puede editar la nota
            else if (`${interaction.member.id}` == `${result[0].perpetrator}` || miembro.permissions.has(PermissionFlagsBits.ManageRoles)) {
                require("../../Modal/editNote").build(interaction, noteID)
            }
            
            // Si no, el bot devolverá error
            else {
                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription("No dispones de los permisos necesarios para editar esta nota.\nSólo el autor/a y usuarios con permisos de gestión de roles pueden.")
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
