const { EmbedBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, ActionRowBuilder } = require("discord.js");
const connection = require("../../../Database/database");
const util = require("util");

module.exports = {
    build: async (interaction, actionRowBuilder, disabled, label, emoji, options) => {
        actionRowBuilder.addComponents(
            new ButtonBuilder()
                .setCustomId(`clearNotes_u${interaction.member.id}_${options.join(",")}`)
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
            const userID = customIDsplitted[2].split(/,+/g)[0];
            const guildId = interaction.guild.id;

            // Obtenemos un array con las notas de ese servidor con esa ID
            const query = util.promisify(connection.query).bind(connection);
            const result = await query(
                `SELECT * FROM userNotes WHERE userID = '${userID}' AND guildID='${guildId}'`
            );

            // Si no existe ninguna, se lo indicamos al usuario
            if (result.length == 0) {
                const embed = new EmbedBuilder()
                    .setDescription("Parece que este usuario no tiene ninguna nota...")
                    .setColor("#ed4245")
                await interaction.reply({ embeds: [embed], ephemeral: true })
            }

            // Si el usuario es el autor o tiene permisos de gestión de roles, puede eliminar la nota
            else if (miembro.permissions.has(PermissionFlagsBits.ManageGuild)) {
                
                const row = new ActionRowBuilder()
                require("../clearNotesConfirm").build(interaction, row, true, [userID])
                require("../cancel").build(interaction, row, true)

                const erow = new ActionRowBuilder()
                require("../clearNotesConfirm").build(interaction, erow, false, [userID])
                require("../cancel").build(interaction, erow, false)

                await interaction.update({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription("Estás a punto de eliminar todas las notas de este usuario.\n¿Quieres continuar?")
                            .setColor("#ed4245")
                    ],
                    components: [row]
                }).catch((e)=>{client.sendError(client, e)}).then((m) => {
                    setTimeout(function() {
                        interaction.editReply({
                            components: [erow]
                        }).catch((e)=>{client.sendError(client, e)})
                    }, 2000)
                })
            }

            // Si no, el bot devolverá error
            else {
                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription("No dispones de los permisos necesarios para limpiar el historial.\nSólo usuarios con permisos de gestión del servidor pueden.")
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
