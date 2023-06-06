const { EmbedBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const connection = require("../../../Database/database");

module.exports = {
    build: async (interaction, actionRowBuilder, disabled) => {
        actionRowBuilder.addComponents(
            new ButtonBuilder()
                .setCustomId(`cancel_u${interaction.member.id}`)
                .setLabel("Cancelar")
                .setStyle(ButtonStyle.Danger)
                .setDisabled(disabled)
        );
    },

    run: async (client, interaction) => {
        await interaction.update({
            content: "Operación cancelada exitosamente",
            embeds: [],
            components: [],
        }).catch((e) => {
            client.sendEmbed(interaction, "Parece que ocurrió un error", "#ed4245")
            client.sendError(client, e)
        }).then((m) => {
            setTimeout(function() {try {m.delete().catch(()=>{})} catch {}}, 5000)
        })
    },
};
