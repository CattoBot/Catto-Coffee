const { Colors } = require("discord.js");

module.exports = {
  TOKEN: process.env.TOKEN,
  PREFIX: process.env.PREFIX,
  Slash: {
    Global: true,
    GuildID: process.env.GuildID,
  },
  embed: {
    color: Colors.White,
    wrongColor: Colors.Red,
  },
  emoji: {
    success: "✅",
    error: "⚠️",
  },
  database: {
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
  },
  database_secondary: {
    host: process.env.HOST_SECONDARY,
    user: process.env.USER_SECONDARY,
    password: process.env.PASSWORD_SECONDARY,
    database: process.env.DATABASE_SECONDARY,
  },
  version: "Catto Beta v0.095"
};
