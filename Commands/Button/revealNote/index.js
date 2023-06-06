const { EmbedBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, ActionRowBuilder } = require("discord.js");
const connection = require("../../../Database/database");
const util = require("util");

module.exports = {
    build: async (interaction, actionRowBuilder, disabled, label, emoji, options) => {
        actionRowBuilder.addComponents(
            new ButtonBuilder()
                .setCustomId(`revealNote_u${interaction.member.id}_${options.join(",")}`)
                .setLabel(emoji?" ":label)
                .setDisabled(disabled)
                .setStyle(ButtonStyle.Secondary)
                .setEmoji(emoji)
        );
    },

    run: async (client, interaction) => {
        try {

            const customIDsplitted = interaction.customId.split(/_+/g);
            const miembro = interaction.member;
            const noteID = customIDsplitted[2].split(/,+/g)[0]
            const guildId = interaction.guild.id;

            const query = util.promisify(connection.query).bind(connection);
            const result = await query(
                `SELECT * FROM userNotes WHERE noteID = ${noteID} AND guildID = '${guildId}'`
            );

            const embed = new EmbedBuilder()
            .setColor("#2b2d31")

            if (result.length === 0) {
                embed
                    .setColor("#ed4245")
                    .setDescription("Parece ser que esta nota ya no existe en el servidor...\n¿La habrá eliminado alguien?")

            } else if (result[0].readRoleID=="PUBLIC"||interaction.member.roles.cache.has(result[0].readRoleID)||miembro.permissions.has(PermissionFlagsBits.ManageGuild)) {
                const nota = result[0]
                const user = await client.users.fetch(nota.userID);
                const member = await client.users.fetch(nota.perpetrator);
                embed
                    .setAuthor({ name: member.username + "#" + member.discriminator, iconURL: member.avatarURL() })
                    .setDescription(`**Miembro:** ${user ? `${user.username + "#" + user.discriminator} (${nota.userID})` : `${nota.userID}`}${isNaN(nota.readRoleID) ? "" : `\n**Restricciones:** <@&${nota.readRoleID}>`}\n**Nota:** ${nota.note.replace(/%39%+/g, "'").substring(0, 1800)}`)
                    .setFooter({ text: `Nota #${noteID}` })
                    .setTimestamp(parseInt(nota.unix))
            } else {
                embed
                    .setColor("#ed4245")
                    .setDescription("No posees el rol necesario para ver esta nota")
            }

            await interaction.reply({ embeds: [embed], ephemeral: true }).catch((err)=>{console.log(err)})

        } catch (err) {
            console.log(err);
            await interaction.update({
                content: "¡Error!",
                embeds: [],
                components: [],
            });
        }
    },
};
