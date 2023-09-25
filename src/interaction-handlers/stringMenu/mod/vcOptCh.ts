import { InteractionHandler, InteractionHandlerTypes, PieceContext } from '@sapphire/framework';
import { Utils } from '../../../util/utils';
import { Catto_Coffee } from '../../../Catto';
import {
  ActionRowBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  GuildMember,
  ButtonBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction
} from "discord.js";

const emojis = {
  selfMuted: "<:selfMuted:1092727485919154246>",
  serverMuted: "<:serverMute:1092727481464799292>",
  selfDeafen: "<:selfDeafened:1092727483289313290>",
  serverDeafen: "<:serverDeafened:1092727528038350919>",
  unmute: "<:unmute:1092728384401965166>",
  undeafen: "<:undeafened:1092728381499523132>",
  mod: "<:moderator:1092825523849273384>",
  admin: "<:admin:1092832350783688785>",
};

interface optionsObject {
  disabled: boolean | undefined,
  author: string | undefined
}

interface toreplyObject {
  embed: EmbedBuilder | undefined
}

export const build = async (actionRowBuilder: ActionRowBuilder, options: optionsObject, data: String[] | undefined) => {
  return new Promise(resolve => {
    actionRowBuilder.addComponents(
      new StringSelectMenuBuilder()
        .setCustomId(`mod:vcOptCh_u${options.author}_${data?.join(",")}`)
        .setPlaceholder(options.disabled ? "Menú no disponible" : "Seleccione una opción")
        .setDisabled(options.disabled)
        .setOptions(
          {
            label: "Mute all",
            emoji: "1092727481464799292",
            value: "mute:ALL:true",
          },
          {
            label: "Unmute all",
            emoji: "1092728384401965166",
            value: "mute:ALL:false",
          },
          {
            label: "Desalojar el canal",
            emoji: "1092861994526314636",
            value: "kick:ALL",
          }
        )
    );
    resolve(true)
  })
};

export class MenuHandler extends InteractionHandler {
  public constructor(ctx: PieceContext, options: InteractionHandler.Options) {
    super(ctx, {
      ...options,
      interactionHandlerType: InteractionHandlerTypes.SelectMenu
    });
  }

  public override async parse(interaction: StringSelectMenuInteraction) {
    const cat: string = interaction.customId.split(/:+/g)[0];
    const id: string = interaction.customId.split(/:+/g)[1].split(/_+/g)[0];
   if (cat == __dirname.split(/\/+/g)[__dirname.split(/\/+/g).length - 1] && id == __filename.split(/\/+/g)[__filename.split(/\/+/g).length - 1].split(/\.+/g)[0]) {
      const restriction: string = interaction.customId.split(/:+/g)[1].split(/_+/g)[1];
      let permited: boolean = restriction.startsWith("a")
      if (!permited && restriction.startsWith("u")) {
        permited = (interaction.user.id == restriction.slice(1, restriction.length))
      }
      if (permited) {
        return this.some();
      } else {
        let embed = new EmbedBuilder()
          .setDescription(Utils.getMessages().InteractionOwner.Button)
          .setColor("#ed4245")
        await interaction.reply({ embeds: [embed] })
        return this.none();
      }
    } else {
      return this.none();
    }
  }

  public async run(interaction: StringSelectMenuInteraction) {
    const miembro = interaction.member as GuildMember;

    if (!miembro.permissions.has(PermissionFlagsBits.MuteMembers))
      return interaction.update({
        embeds: [
          new EmbedBuilder()
            .setDescription("No tienes permisos para usar esta opción.")
            .setColor("#fb6444"),
        ],
        components: [],
      });

    const data = interaction.customId
      .split(/_+/g)
    [interaction.customId.split(/_+/g).length - 1].split(/,+/g);
    const channel = data[0];

    var toreply: toreplyObject = { embed: undefined };
    var error: toreplyObject = { embed: undefined };

    var selected = await interaction.values[0];
    selected = selected.replace("ME", interaction.user.id);

    var args: any[] = selected.split(/:+/g);
    for (let i = 0; i < args.length; i++) {
      args[i] = [...args[i].split(/&+/g)];
    }

    if (args[0][0] == "mute") {
      if (!miembro.voice.channel || `${miembro.voice.channel.id}` != `${channel}`) {
        error.embed = new EmbedBuilder()
          .setDescription(
            `Debes estar conectad@ al canal de voz para poder usar esta opción.`
          )
          .setColor("#fb6444");
      } else {

        var users: any[] = [];
        const canal: any = Catto_Coffee.channels.resolve(channel);
        if (canal && canal.type === 2) {
          const members = canal.members;
          members.forEach((user: any) => {
            if (user.id != interaction.user.id && (args[1].includes(user.id) || args[1].includes("ALL")) && !user.permissions.has(PermissionFlagsBits.MuteMembers) && ((!user.voice.serverMute && args[2][0] == "true") || (user.voice.serverMute && args[2][0] == "false"))) {
              try {
                user.voice.setMute(
                  args[2][0] == "true",
                  `El usuario ${interaction.user.id} ha ejecutado una solicitud de mute en el canal ${channel}`
                );
              } catch (err) {
                console.error(err);
              }
            }
            if (user.id != interaction.user.id && (args[1].includes(user.id) || args[1].includes("ALL")) && user.permissions.has(PermissionFlagsBits.MuteMembers)) {
              toreply.embed = new EmbedBuilder()
                .setDescription(
                  "Uno o más usuarios del canal no fueron modificados por sus permisos"
                )
                .setColor("#fee528");
            }
          });
        } else {
          return await interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription("Algo me ha impedido acceder a los datos del canal.\nPor favor, comprueba los permisos del bot.")
                .setColor("#ed4245")
            ], ephemeral: true
          })
        }
      }
    } else if (args[0][0] == "kick") {
      var users: any[] = [];
      const canal: any = Catto_Coffee.channels.resolve(channel);
      if (canal && canal.type === 2) {
        const members = canal.members;
        members.forEach((user: any) => {
          if (
            (args[1].includes(user.id) &&
              !user.permissions.has(PermissionFlagsBits.KickMembers)) ||
            args[1].includes("ALL")
          ) {
            try {
              user.voice.disconnect(
                `El usuario ${interaction.user.id} ha ejecutado una solicitud de desconexión del canal ${user.voice.channel.id}`
              );
            } catch (err) {
              console.error(err);
            }
          }
          if (
            args[1].includes(user.id) &&
            !user.permissions.has(PermissionFlagsBits.KickMembers)
          ) {
            toreply.embed = new EmbedBuilder()
              .setDescription(
                "Uno o más usuarios del canal no fueron modificados por sus permisos"
              )
              .setColor("#fee528");
          }
        });
      } else {
        return await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription("Algo me ha impedido acceder a los datos del canal.\nPor favor, comprueba los permisos del bot.")
              .setColor("#ed4245")
          ], ephemeral: true
        })
      }
    }

    setTimeout(async function () {
      try {

        var users: any[] = [];
        const canal: any = Catto_Coffee.channels.resolve(channel);
        if (canal && canal.type === 2) {
          const members = canal.members;
          members.forEach((user: any) => {
            users.push(
              `${user.voice.mute
                ? `${user.voice.serverMute
                  ? emojis.serverMuted
                  : emojis.selfMuted
                }`
                : emojis.unmute
              }${user.voice.deaf
                ? `${user.voice.serverDeaf
                  ? emojis.serverDeafen
                  : emojis.selfDeafen
                } `
                : emojis.undeafen
              } <@${user.id}> ${user.permissions.has(PermissionFlagsBits.MuteMembers)
                ? `${user.permissions.has(PermissionFlagsBits.ManageGuild)
                  ? `${emojis.admin}`
                  : `${emojis.mod}`
                }`
                : ""
              }`
            );
          })
        } else {
          return await interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription("Algo me ha impedido acceder a los datos del canal.\nPor favor, comprueba los permisos del bot.")
                .setColor("#ed4245")
            ], ephemeral: true
          })
        }
        const embed = new EmbedBuilder()
          .setDescription(
            `<#${channel}>\n\n${users.length > 0
              ? users.slice(0, 30).join("\n")
              : "🦗 \\**Silencio\\**\nNo hay nadie en el canal"
            }`
          )
          .setColor("#313131");
        if (users.length > 30)
          embed.setFooter({
            text: "NO SE HA LOGRADO MOSTRAR A TODOS LOS USUARIOS",
          });
        const row = new ActionRowBuilder<StringSelectMenuBuilder>
        const options = await import('./vcOptCh');
        await options.build(row, { disabled: users.length == 0, author: interaction.customId.split(/:+/g)[1].split(/_+/g)[1].slice(1, interaction.customId.split(/:+/g)[1].length) }, [channel])
        const boton = new ActionRowBuilder<ButtonBuilder>
        const refreshModule = await import('../../buttons/mod/vcRfCh');
        await refreshModule.build(boton, { disabled: false, author: interaction.customId.split(/:+/g)[1].split(/_+/g)[1].slice(1, interaction.customId.split(/:+/g)[1].length) }, [channel])
        await interaction.update({ embeds: [embed], components: [row, boton] });
      } catch (err) {
        console.error(err);
      }

      if (error.embed) {
        await interaction.followUp({
          ephemeral: true,
          embeds: [error.embed],
        });
      } else if (toreply.embed) {
        await interaction.followUp({
          ephemeral: true,
          embeds: [toreply.embed],
        });
      }
    }, 1500);
  }
}