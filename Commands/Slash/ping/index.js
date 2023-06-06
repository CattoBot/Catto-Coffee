const { CommandInteraction, PermissionFlagsBits } = require("discord.js");
const { Bot } = require("../../../handlers/Client");
const connection = require("../../../Database/database");

const { commandBuilder } = require("../../../handlers/classes")
const command = new commandBuilder({
    name: "ping",
    description: "¡Pong!",
    userPermissions: PermissionFlagsBits.SendMessages,
    botPermissions: PermissionFlagsBits.SendMessages,
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
            const botPing = client.ws.ping;
            // Ping a la base de datos.

            let dbPing = 0;
            const pingQuery = "SELECT 1";
            const pingStart = Date.now();

            try {
                await connection.promise().query(pingQuery);
                dbPing = Date.now() - pingStart;
            } catch {
                console.log("Error al hacer ping a la base de datos");
            }
            try {
                return client.sendEmbed(
                    interaction,
                    `Pong! <:Catto_Cookie:1000808773885112431> \n> Bot: \`${botPing} ms\`\n> Base de Datos: \`${dbPing} ms\``
                );
            } catch {
                return client.sendEmbed(
                    interaction,
                    "Ha ocurrido un error, intenta nuevamente."
                );
            }
        } catch (err) {
            client.sendError(client, err, "/ping")
            client.sendEmbed(interaction, "Parece que hubo un error en este comando.\nPor favor, si persiste, comuníquelo.", "#ed4245")
        }
    },
};
