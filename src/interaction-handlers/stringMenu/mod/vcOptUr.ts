import { InteractionHandler, InteractionHandlerTypes, PieceContext } from '@sapphire/framework';

import { Catto_Coffee } from '../../../App';
import {
  ActionRowBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  GuildMember,
  ButtonBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction
} from "discord.js";
import { Utils } from '../../../util/utils';
const { Emojis, Messages } = Utils
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
        .setCustomId(`mod:vcOptUr_u${options.author}_${data?.join(",")}`)
        .setPlaceholder(options.disabled ? "Menú no disponible" : "Seleccione una opción")
        .setDisabled(options.disabled)
        .setOptions(
          {
            label: "Mute user",
            emoji: "1092727481464799292",
            value: "mute:HIM:true",
          },
          {
            label: "Unmute user",
            emoji: "1092728384401965166",
            value: "mute:HIM:false",
          },
          {
            label: "Desconectar",
            emoji: "1092861994526314636",
            value: "kick:HIM",
          },
          {
            label: "Ir a su canal",
            emoji: "1092751257145462784",
            value: "move:ME:HIM",
          },
          {
            label: "Traer a mi canal",
            emoji: "1092751257145462784",
            value: "move:HIM:ME",
          },
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
            label: "Desalojar canal",
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
          .setDescription(Messages.InteractionOwner.Button)
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

    // Si el usuario no posee los permisos necesarios devuelve un mensaje de error
    if (!(miembro.permissions.has(PermissionFlagsBits.MuteMembers) && miembro.permissions.has(PermissionFlagsBits.MoveMembers) && miembro.permissions.has(PermissionFlagsBits.KickMembers)))
      return await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription("Parece ser que no dispones de los permisos necesarios")
            .setColor("#ed4245")
        ]
      })

    // Declara el array de información que obtendremos de la ID de la lista
    const data = interaction.customId.split(/_+/g)[interaction.customId.split(/_+/g).length - 1].split(/,+/g);

    // El ID del usuario será el primer valor, en este caso el único
    const user = data[0];

    // El miembro será obtenido a partir de su ID
    const member = interaction.guild?.members.cache.get(user);

    // Declararemos dos variables que determinarán los mensajes que el bot devolverá una vez el trabajo de la interacción finalice
    var error: toreplyObject = { embed: undefined };
    var toreply: toreplyObject = { embed: undefined };

    // Si el miembro no existe o abandonó el servidor, constamos como error el que el usuario no ha sido encontrado
    if (!member) {
      error.embed = new EmbedBuilder()
        .setDescription("No se ha logrado encontrar al usuario en el servidor.")
        .setColor("#ed4245");
    }

    // De lo contrario, si no está en ningún canal de voz, indicamos un mensaje de error al no poder monitorizarlo
    else if (!member.voice.channel) {
      error.embed = new EmbedBuilder()
        .setDescription("El usuario ha abandonado los canales de voz.")
        .setColor("#ed4245");
    }

    // De lo contrario, entendemos que podemos monitorizarlo y se procede
    else {

      // Obtenemos la opción que se desea llevar a cabo
      var selected = interaction.values[0];

      // Reemplazamos las variables por valores
      selected = selected.replace("HIM", user).replace("ME", miembro.id);

      // Declaramos los argumentos
      var args: any[] = selected.split(/:+/g);

      // Subdividimos los argumentos en más arrays
      for (let i = 0; i < args.length; i++) {
        args[i] = [...args[i].split(/&+/g)];
      }

      // Declaramos la opción como el argumento [0][0]
      const opcion = args[0][0]

      // Si la opción es mute...
      if (opcion == "mute") {
        if (
          !miembro.voice.channel ||
          `${miembro.voice.channel.id}` !=
          `${member.voice.channel.id}`
        ) {
          error.embed = new EmbedBuilder()
            .setDescription(
              `Debes estar conectad@ al canal de voz para poder usar esta opción.`
            )
            .setColor("#fb6444");
        } else {

          const canal: any = Catto_Coffee.channels.resolve(member.voice.channel.id);
          if (canal && canal.type === 2) {
            const members = canal.members;
            members.forEach((user: any) => {
              if (
                (args[1].includes(user.id) || args[1].includes("ALL")) &&
                user.id != miembro.id &&
                !user.permissions.has(PermissionFlagsBits.MuteMembers) &&
                ((!user.voice.serverMute && args[2][0] == "true") ||
                  (user.voice.serverMute && args[2][0] == "false"))
              ) {
                user.voice.setMute(
                  args[2][0] == "true",
                  `El usuario ${miembro.id
                  } ha ejecutado una solicitud de ${args[2][0] == "true" ? "un" : ""
                  }mute en el canal ${user.voice.channel.id}`
                );
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
      }

      // Si laopción es move...
      else if (opcion == "move") {
        if (!member.voice.channel) {
          error.embed = new EmbedBuilder()
            .setDescription(
              `Debes estar conectad@ a un canal de voz para poder usar esta opción.`
            )
            .setColor("#fb6444");
        } else if (args[1][0] == "US") {
          if (!Catto_Coffee.channels.cache.get(args[2][0])) {
            error.embed = new EmbedBuilder()
              .setDescription("No se ha encontrado el canal en el servidor\n¿El bot puede verlo?")
              .setColor("#fb6444");
          } else {
            member.voice.setChannel(args[2][0], `El usuario ${member.id} ha ejecutado una solicitud de traslado al canal ${args[2][0]}`)
              .catch(() => {
                error.embed = new EmbedBuilder()
                  .setDescription(`Algo ha impedido a Catto mover al usuario <@${member.id}>`)
                  .setColor("#fb6444");
              })

            member.voice
              .setChannel(args[2][0], `El usuario ${member.id} ha ejecutado una solicitud de traslado al canal ${args[2][0]}`)
              .catch((m) => {
                error.embed = new EmbedBuilder()
                  .setDescription(`Algo ha impedido a Catto mover al usuario <@${member.id}>`)
                  .setColor("#fb6444");
              });
          }
        } else {
          let tempmember = interaction.guild?.members.cache.get(args[1][0]) as GuildMember;
          let tempmember_2 = interaction.guild?.members.cache.get(args[2][0]) as GuildMember;
          let tempchannel: any = args[2][0];
          if (!Catto_Coffee.channels.cache.get(tempchannel))
            tempchannel = tempmember_2.voice.channel?.id;
          tempmember?.voice.setChannel(
            tempchannel,
            `El usuario ${member.id} ha ejecutado una solicitud de traslado al canal ${tempchannel}`
          );
        }
      }

      // Si la opción es kick...
      else if (opcion == "kick") {

        const canal: any = Catto_Coffee.channels.resolve(member.voice.channel.id);
        if (canal && canal.type === 2) {
          const members = canal.members;
          members.forEach((user: any) => {

            if (
              (args[1].includes(user.id) &&
                !user.permissions.has(PermissionFlagsBits.KickMembers)) ||
              args[1].includes("ALL")
            ) {
              user.voice.disconnect(
                `El usuario ${member.id} ha ejecutado una solicitud de desconexión del canal ${user.voice.channel.id}`
              );
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
    }

    // Indicamos que en 1,5 segundos el cuadro debe ser actualizado
    setTimeout(async function () {
      var users: any[] = [];
      const embed = new EmbedBuilder();
      var disabled: boolean = true

      if (!member?.voice.channel) {
        embed
          .setDescription("El usuario no se encuentra en ningún canal de voz")
          .setColor("#fb6444");
      } else {
        const canal: any = Catto_Coffee.channels.resolve(member.voice.channel.id);
        if (canal && canal.type === 2) {
          const members = canal.members;
          members.forEach((user: any) => {
            users.push(
              `${user.voice.mute
                ? `${user.voice.serverMute ? Emojis.VoiceMod.serverMuted : Emojis.VoiceMod.selfMuted
                }`
                : Emojis.VoiceMod.unmute
              }${user.voice.deaf
                ? `${user.voice.serverDeaf
                  ? Emojis.VoiceMod.serverDeafen
                  : Emojis.VoiceMod.selfDeafen
                } `
                : Emojis.VoiceMod.undeafen
              } <@${user.id}> ${user.permissions.has(PermissionFlagsBits.MuteMembers)
                ? `${user.permissions.has(PermissionFlagsBits.ManageGuild)
                  ? `${Emojis.VoiceMod.admin}`
                  : `${Emojis.VoiceMod.mod}`
                }`
                : ""
              }`
            );
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
        embed
          .setDescription(
            `**<@${member.id}> se encuentra en <#${member.voice.channel.id
            }>**\n\n${users.length > 0
              ? users.slice(0, 30).join("\n")
              : "🦗 \\**Silencio\\**\nNo hay nadie en el canal"
            }`
          )
          .setColor("#313131");
        if (users.length > 30)
          embed.setFooter({
            text: "NO SE HA LOGRADO MOSTRAR A TODOS LOS USUARIOS",
          });
        if (users.length >= 1) {
          disabled = false
        }
      }

      const row = new ActionRowBuilder<StringSelectMenuBuilder>
      const options = await import('../mod/vcOptUr');
      await options.build(row, { disabled: disabled, author: interaction.customId.split(/:+/g)[1].split(/_+/g)[1].slice(1, interaction.customId.split(/:+/g)[1].length) }, [`${member?.id}`])

      const boton = new ActionRowBuilder<ButtonBuilder>
      const module = await import('../../buttons/mod/vcRfUr');
      await module.build(boton, { disabled: false, author: interaction.customId.split(/:+/g)[1].split(/_+/g)[1].slice(1, interaction.customId.split(/:+/g)[1].length) }, [`${member?.id}`])

      await interaction.update({ embeds: [embed], components: [row, boton] });

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