const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
  EmbedBuilder,
} = require("discord.js");
const config = require("../settings/config");

class Bot extends Client {
  constructor() {
    super({
      partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.Message,
        Partials.User,
      ],
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
      ],
      shards: "auto",
      failIfNotExists: false,
      allowedMentions: {
        parse: ["everyone", "roles", "users"],
        users: [],
        roles: [],
        repliedUser: false,
      },
    });

    // global variables
    this.config = require("../settings/config");
    this.scommands = new Collection();
    this.mcommands = new Collection();
    this.cooldowns = new Collection();
    this.events = 0;
  }

  async build(token) {
    await loadHandlers(this);
    this.login(token);
  }

  sendError(client, err, foot) {
    try {
      if (client.user.id=="1000184915591168080") {
        client.channels.resolve("998844282721021972").send({embeds:[
          new EmbedBuilder()
            .setTitle(err.name)
            .setColor("#ed4245")
            .setDescription("```\n"+err.message+"\n```")
            .setFooter({text: foot?foot:"¡Vaya error!"})
            .setTimestamp()
        ]}).catch(()=>{})
      }
    } finally {
      console.error(`\n\n\n\n\x1b[41m\x1b[30mERROR DETECTADO ${err.name}\x1b[0m`)
      console.error(err)
    }
  }

  sendEmbed(interaction, data, color) {
    if (interaction.deferred) {
      interaction
        .followUp({
          embeds: [
            new EmbedBuilder()
              .setColor(color?color:this.config.embed.color)
              .setDescription(`${data.substring(0, 3000)}`)
              .setFooter({text: config.version}),
          ],
        })
        .catch((e) => {});
    } else {
      interaction
        .reply({
          embeds: [
            new EmbedBuilder()
              .setColor(this.config.embed.color)
              .setDescription(`${data.substring(0, 3000)}`)
              .setFooter({text: config.version}),
          ],
        })
        .catch((e) => {});
    }
  }

  getFooter(user) {
    return {
      text: `Pedido por: ${user.username}`,
      iconURL: user.displayAvatarURL(),
    };
  }
}

module.exports = { Bot };

function loadHandlers(client) {
  ["handler"].forEach((file) => {
    require(`./${file}`)(client);
  });
}
