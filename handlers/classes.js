const { ApplicationCommandType } = require("discord.js");
const { readdirSync, existsSync } = require("fs");
const client = require("../index");

class commandBuilder {
  type = ApplicationCommandType.ChatInput;
  constructor(data) {
    try {
      this.name = data.name;
      this.name_localizations = data.name_localizations;
      this.description = data.description;
      this.description_localizations = data.description_localizations;
      this.userPermissions = data.userPermissions;
      this.botPermissions = data.botPermissions;
      this.options = [];
      let count = 0; // variable para contar el total de subcomandos
      var subcommands = []
      if (existsSync(`./Commands/Slash/${this.name}/cmd`)) subcommands = readdirSync(`./Commands/Slash/${this.name}/cmd`);
      if (subcommands.length > 0) {
        subcommands.forEach((sub) => {
          try {
            const sc = require(`../Commands/Slash/${this.name}/cmd/${sub}/index.js`)
            this.options.push({
              name: sc.command.name,
              name_localizations: sc.command.name_localizations,
              description: sc.command.description,
              description_localizations: sc.command.description_localizations,
              type: sc.command.type,
              options: sc.command.options,
            });
            if (sc.command.type == 2) {
              console.log(
                "\x1b[32m\x1b[1m%s\x1b[0m",
                `Subcommandgroup cargado: \x1b[36m${sc.command.name}\x1b[0m ✅`
              );
            } else {
              console.log(
                "\x1b[32m\x1b[1m%s\x1b[0m",
                `Subcommand cargado: \x1b[36m${sc.command.name}\x1b[0m ✅`
              );
            }
            count++; // aumentamos el contador por cada subcomando cargado
          } catch (err) {
            client.sendError(client, err)
          }
        });
      }
      console.log(
        "\x1b[34m\x1b[1m\x1b[4m%s\x1b[0m",
        `[ ${count} ${this.name.toUpperCase()} SUBCOMMANDS CARGADOS ]`
      );
    } catch (err) {
      client.sendError(client, err)
    }
  }
}

class subcommandGroupBuilder {
  type = 2;
  constructor(data, commandName) {
    try {
      this.name = data.name;
      this.name_localizations = data.name_localizations;
      this.description = data.description;
      this.description_localizations = data.description_localizations;
      this.userPermissions = data.userPermissions;
      this.botPermissions = data.botPermissions;
      this.options = [];
      let count = 0; // variable para contar el total de subcomandos
      const subcommands = readdirSync(`./Commands/Slash/${commandName}/cmd/${this.name}`).filter((f) => !f.endsWith(".js"));
      subcommands.forEach((sub) => {
        try {
          const sc = require(`../Commands/Slash/${commandName}/cmd/${this.name}/${sub}/index.js`)
          this.options.push({
            name: sc.command.name,
            name_localizations: sc.command.name_localizations,
            description: sc.command.description,
            description_localizations: sc.command.description_localizations,
            type: 1,
            options:
              sc.command.options && sc.command.options.length > 0
                ? [...sc.command.options]
                : undefined,
          });
          console.log(
            "\x1b[32m\x1b[1m%s\x1b[0m",
            `Subcommand cargado: \x1b[36m${sc.command.name}\x1b[0m ✅`
          );
          count++; // aumentamos el contador por cada subcomando cargado
        } catch (err) {
          client.sendError(client, err)
        }
      });
      console.log(
        "\x1b[34m\x1b[1m\x1b[4m%s\x1b[0m",
        `[ ${count} ${commandName.toUpperCase()} SUBCOMMANDSGROUPS CARGADOS ]`
      );
    } catch (err) {
      client.sendError(client, err)
    }
  }
}

class subcommandBuilder {
  type = 1;
  constructor(data) {
    try {
      this.name = data.name;
      this.name_localizations = data.name_localizations;
      this.description = data.description;
      this.description_localizations = data.description_localizations;
      this.userPermissions = data.userPermissions;
      this.botPermissions = data.botPermissions;
      if (data.options && data.options.length > 0) {
        this.options = [...data.options];
      } else {
        this.options = undefined;
      }
      this.cooldown = data.cooldown;
    } catch (err) {
      client.sendError(client, err)
    }
  }
}

class userCommandBuilder {
  type = ApplicationCommandType.User;
  constructor(data) {
    this.name = data.name;
    this.ephemeral = data.ephemeral;
    this.userPermissions = data.userPermissions;
    this.botPermissions = data.botPermissions;
  }
}

class messageCommandBuilder {
  type = ApplicationCommandType.Message;
  constructor(data) {
    this.name = data.name;
    this.ephemeral = data.ephemeral;
    this.userPermissions = data.userPermissions;
    this.botPermissions = data.botPermissions;
  }
}

module.exports = {
  commandBuilder,
  subcommandGroupBuilder,
  subcommandBuilder,
  userCommandBuilder,
  messageCommandBuilder,
};
