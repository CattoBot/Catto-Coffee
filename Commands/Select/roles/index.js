const {
  EmbedBuilder,
  StringSelectMenuBuilder,
  ActionRowBuilder,
} = require("discord.js");
const rolesJSON = require("../../../json/gw.json");

module.exports = {
  build: async (interaction, actionRowBuilder, options) => {
    actionRowBuilder.addComponents(
      new StringSelectMenuBuilder()
        .setCustomId(`roles_a${interaction.member.id}`)
        .setPlaceholder("Seleccione una opción")
        .addOptions(options)
    );
  },

  run: async (client, interaction) => {
    await interaction.deferReply({ ephemeral: true });

    const selected = await interaction.values[0];

    var roles = rolesJSON.roles;
    roles = roles.sort(function (a, b) {
      if (a.id > b.id) return -1;
      if (b.id < a.id) return 1;
      return 0;
    });

    const rol = roles.filter((role) => `${role.id}` == `${selected}`)[0];

    var allowed = false;

    var embed = new EmbedBuilder()
      .setTitle(rol.name)
      .setDescription(rol.description);

    if (rol.wl.length > 0) {
      embed.addFields({
        name: `Rol${rol.wl.length > 1 ? "es necesarios" : " necesario"}:`,
        value: `<@&${rol.wl.join(">\n<@&")}>`,
      });
      rol.wl.forEach((rol) => {
        if (interaction.member.roles.cache.has(rol)) {
          allowed = true;
        }
      });
    } else {
      allowed = true;
    }

    var removeDisabled = true;
    if (interaction.member.roles.cache.has(selected)) {
      allowed = false;
      removeDisabled = false;
    }

    const row = new ActionRowBuilder();
    require("../../Button/getRol/index").build(interaction, row, !allowed, [
      selected,
    ]);
    require("../../Button/removeRol/index").build(
      interaction,
      row,
      removeDisabled,
      [selected]
    );
    await interaction.editReply({ embeds: [embed], components: [row] });
  },
};
