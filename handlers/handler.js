const { Bot } = require("./Client");
const { readdirSync } = require("fs");
const {
  Slash: { Global, GuildID },
} = require("../settings/config");
const connection = require("../Database/database");
/**
 *
 * @param {Bot} client
 */
module.exports = async (client) => {
  try {
    let allCommands = [];
    const slashCommandsFolder = "./Commands/Slash";
    const slashCommandFolders = readdirSync(slashCommandsFolder, {
      withFileTypes: true,
    })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    for (const folder of slashCommandFolders) {
      const commands = readdirSync(`${slashCommandsFolder}/${folder}`).filter(
        (file) => file.endsWith(".js")
      );

      commands.forEach((cmd) => {
        const command = require(`../${slashCommandsFolder}/${folder}/index`);
        if (command.command.name) {
          client.scommands.set(command.command.name, command);
          allCommands.push(command.command);
        } else {
          console.log(
            "\x1b[31m\x1b[1m%s\x1b[0m",
            `${commandFile} no está listo.`
          );
        }
      });
    }

    client.on("ready", async () => {
      if (Global) {
        client.application.commands.set(allCommands);
      } else {
        client.guilds.cache.get(GuildID)?.commands.set(allCommands);
      }
    });
  } catch (error) {
    console.log("\x1b[31m\x1b[1m%s\x1b[0m", error);
  }

  //   Event Handler
  try {
    readdirSync("./events")
      .filter((f) => f.endsWith(".js"))
      .forEach((event) => {
        require(`../events/${event}`);
        client.events++;
        console.log("\x1b[32m\x1b[1m%s\x1b[0m", `Cargado evento: ${event} ✅`);
      });

    console.log(
      "\x1b[36m\x1b[1m%s\x1b[0m",
      `[ ${client.events} EVENTOS CARGADOS]`
    );
  } catch (error) {
    console.log(error);
  }

  // Function Loader
  // try {
  //   const functionfiles = readdirSync("./functions").filter((file) =>
  //     file.endsWith(".js")
  //   );
  //   const functions = [];
  //   functionfiles.forEach((file) => {
  //     const funcion = require(`../functions/${file}`);
  //     functions.push(funcion);

  //     console.log("\x1b[32m\x1b[1m%s\x1b[0m", `Función: ${file} ✅`);
  //   });
  //   client.functions = functions;
  //   console.log(
  //     "\x1b[36m\x1b[1m%s\x1b[0m",
  //     `[ ${functionfiles.length} FUNCIONES CARGADAS]`
  //   );
  // } catch (error) {
  //   console.log(error);
  // }

  // Module Loader
  // try {
  //   const moduleFiles = readdirSync("./modules").filter((file) =>
  //     file.endsWith(".js")
  //   );
  //   const modules = [];
  //   moduleFiles.forEach((file) => {
  //     const module = require(`../modules/${file}`);
  //     modules.push(module);

  //     console.log("\x1b[32m\x1b[1m%s\x1b[0m", `Módulo: ${file} ✅`);
  //   });
  //   client.modules = modules;
  //   console.log(
  //     "\x1b[36m\x1b[1m%s\x1b[0m",
  //     `[ ${moduleFiles.length} MÓDULOS CARGADOS]`
  //   );
  // } catch (error) {
  //   console.log(error);
  // }

  try {
    connection.connect((err) => {
      if (err) {
        console.log(
          "\x1b[31m\x1b[1m%s\x1b[0m",
          "Error al conectar con la base de datos."
        );
        console.log(err);
      } else {
        console.log(
          "\x1b[32m\x1b[1m%s\x1b[0m",
          "Conectado a la base de datos MySQL correctamente. ✅"
        );
      }
    });
  } catch {
    console.log(
      "\x1b[31m\x1b[1m%s\x1b[0m",
      "Error al conectar con la base de datos."
    );
  }
};
