const {
  InteractionType,
  PermissionsBitField,
  EmbedBuilder,
} = require("discord.js");
const client = require("../index");

client.on("interactionCreate", async (interaction) => {
  if (interaction.user.bot || !interaction.guild) return;
  if (interaction.isCommand()) {
    const command = client.scommands.get(interaction.commandName);
    if (!command) {
      return interaction.reply({
        content: `\`${interaction.commandName}\` No es un comando válido.`,
        ephemeral: true,
      });
    }
    if (
      command.command.userPermissions &&
      !interaction.member.permissions.has(
        PermissionsBitField.resolve(command.command.userPermissions)
      )
    ) {
      return client.sendEmbed(
        interaction,
        `No tienes suficientes permisos para usar este comando.`
      );
    }

    if (
      command.command.botPermissions &&
      !interaction.guild.members.me.permissions.has(
        PermissionsBitField.resolve(command.command.botPermissions)
      )
    ) {
      return client.sendEmbed(interaction, `No tengo suficientes permisos.`);
    }
    try {
      command.run(client, interaction).catch((err)=>{
        client.sendError(client, err)
        client.sendEmbed(interaction, "Parece que hubo un error.\nSi el error persiste, por favor, comuníquelo.", "#ed4245")
      })
    } catch (err) {
      client.sendError(client, err, `Error al usar el comando ${command.command.name}`)
      return client.sendEmbed(
        interaction,
        `Ocurrió un error al ejecutar el comando.`
      );
    }
  } else if (interaction.isStringSelectMenu()) {
    const customIDsplitted = interaction.customId.split(/_+/g);
    const author = customIDsplitted[1];
    var authorTypeUser, allowed, authorID;
    try {
      if (author.startsWith("a")) allowed = true;
      else {
        authorID = author.substring(1);
        if (author.startsWith("r")) {
          authorTypeUser = false;
          allowed = interaction.member.roles.cache.has(authorID);
        } else if (author.startsWith("u")) {
          authorTypeUser = true;
          allowed = `${interaction.member.id}` == authorID;
        }
      }
      if (!allowed)
        return await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                authorTypeUser
                  ? `Hey <@${interaction.member.id}>\nParece ser que esta lista no es para que la uses tú`
                  : `Hey <@${interaction.member.id}>\nNo posees el rol necesario para usar esta lista`
              )
              .setColor("#fb6444"),
          ],
          ephemeral: true,
        });
    } catch (err) {
      client.sendError(client, err, `Error al detectar el autor de la lista ${customIDsplitted[0]}`)
    }

    try {
      require(`../Commands/Select/${customIDsplitted[0]}/index.js`).run(client,interaction).catch((err)=>{
        client.sendError(client, err)
        client.sendEmbed(interaction, "Parece que hubo un error.\nSi el error persiste, por favor, comuníquelo.", "#ed4245")
      })
    } catch (err) {
      client.sendError(client, err, `Error al usar la lista ${customIDsplitted[0]}`)
      return client.sendEmbed(
        interaction,
        "No hemos encontrado esta lista en nuestra base de datos.\nParece que has encontrado una lista fantasma :ghost:",
        "#fb6444",
        true
      );
    }
  } else if (interaction.isButton()) {
    const customIDsplitted = interaction.customId.split(/_+/g);
    const author = customIDsplitted[1];
    var authorTypeUser, allowed, authorID;
    try {
      if (author.startsWith("a")) allowed = true;
      else {
        authorID = author.substring(1);
        if (author.startsWith("r")) {
          authorTypeUser = false;
          allowed = interaction.member.roles.cache.has(authorID);
        } else if (author.startsWith("u")) {
          authorTypeUser = true;
          allowed = `${interaction.member.id}` == authorID;
        } else
          return client.sendEmbed(
            interaction,
            "**BOTÓN DESACTUALIZADO**\nEste botón no sigue nuestros nuevos esquemas de organización",
            "#fb6444",
            true
          );
      }
      if (!allowed)
        return await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                authorTypeUser
                  ? `Hey <@${interaction.member.id}>\nParece ser que este botón no es para que la uses tú`
                  : `Hey <@${interaction.member.id}>\nNo posees el rol necesario para usar este botón`
              )
              .setColor("#fb6444"),
          ],
          ephemeral: true,
        });
    } catch (err) {
      client.sendError(client, err, `Error al detectar el autor en el botón ${customIDsplitted[0]}`)
    }

    try {
      require(`../Commands/Button/${customIDsplitted[0]}/index.js`).run( client, interaction ).catch((err)=>{
        client.sendError(client, err)
        client.sendEmbed(interaction, "Parece que hubo un error.\nSi el error persiste, por favor, comuníquelo.", "#ed4245")
      })
    } catch (err) {
      client.sendError(client, err, `Error al usar el botón ${customIDsplitted[0]}`)
      return client.sendEmbed(
        interaction,
        "No hemos encontrado este botón en nuestra base de datos.\nParece que has encontrado un botón fantasma :ghost:",
        "#fb6444",
        true
      );
    }
  } else if (interaction.isModalSubmit()) {
    const customIDsplitted = interaction.customId.split(/_+/g);
    try {
      require(`../Commands/Modal/${customIDsplitted[0]}/index.js`).run( client, interaction ).catch((err)=>{
        client.sendError(client, err)
        client.sendEmbed(interaction, "Parece que hubo un error.\nSi el error persiste, por favor, comuníquelo.", "#ed4245")
      })
    } catch (err) {
      client.sendError(client, err, `Error al usar el formulario ${customIDsplitted[0]}`)
      return client.sendEmbed(
        interaction,
        "No hemos encontrado este formulario en nuestra base de datos.\nParece que has encontrado un formulario fantasma :ghost:",
        "#fb6444",
        true
      );
    }
  }
});
