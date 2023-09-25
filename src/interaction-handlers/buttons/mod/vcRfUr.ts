import { InteractionHandler, InteractionHandlerTypes, PieceContext } from '@sapphire/framework';
import { Catto_Coffee } from '../../../Catto';
import { Utils } from '../../../util/utils';
import {
  ActionRowBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  ButtonInteraction,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  GuildMember
} from "discord.js";

interface optionsObject {
  disabled: boolean | undefined,
  author: string | undefined
}

export const build = async (actionRowBuilder: ActionRowBuilder, options: optionsObject, data: String[] | undefined) => {
  return new Promise(resolve => {
    actionRowBuilder.addComponents(
      new ButtonBuilder()
        .setCustomId(`mod:vcRfUr_a${options.author}_${data?.join(",")}`)
        .setLabel("Actualizar")
        .setDisabled(options?.disabled)
        .setStyle(ButtonStyle.Primary)
    );
    resolve(true)
  })
};

export class ButtonHandler extends InteractionHandler {
  public constructor(ctx: PieceContext, options: InteractionHandler.Options) {
    super(ctx, {
      ...options,
      interactionHandlerType: InteractionHandlerTypes.Button
    });
  }

  public override async parse(interaction: ButtonInteraction) {
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

  public async run(interaction: ButtonInteraction) {
    const customIDsplitted = interaction.customId.split(/_+/g);
    const usuario = customIDsplitted[2].split(/,+/g)[0];

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

    const user = interaction.guild?.members.cache.get(usuario);
    if (!user)
      return await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription("No se ha encontrado al usuario en el servidor.")
            .setColor("#ed4245")
        ], ephemeral: true
      })

    var disabled = !user.voice.channel;
    const embed = new EmbedBuilder();

    if (user.voice.channel) {
      var users: any[] = [];

      const canal: any = Catto_Coffee.channels.resolve(user.voice.channel.id);
      if (canal && canal.type === 2) {
        const members = canal.members;
        members.forEach((user: any) => {
          users.push(
            `${user.voice.mute
              ? `${user.voice.serverMute ? Utils.getEmojis().VoiceMod.serverMuted : Utils.getEmojis().VoiceMod.selfMuted
              }`
              : Utils.getEmojis().VoiceMod.unmute
            }${user.voice.deaf
              ? `${user.voice.serverDeaf
                ? Utils.getEmojis().VoiceMod.serverDeafen
                : Utils.getEmojis().VoiceMod.selfDeafen
              } `
              : Utils.getEmojis().VoiceMod.undeafen
            } <@${user.id}> ${user.permissions.has(PermissionFlagsBits.MuteMembers)
              ? `${user.permissions.has(PermissionFlagsBits.ManageGuild)
                ? `${Utils.getEmojis().VoiceMod.admin}`
                : `${Utils.getEmojis().VoiceMod.mod}`
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
          `**<@${user.id}> se encuentra en <#${user.voice.channel.id
          }>**\n\n${users.slice(0, 30).join("\n")}`
        )
        .setColor("#313131");
      if (users.length > 30)
        embed.setFooter({
          text: "NO SE HA LOGRADO MOSTRAR A TODOS LOS USUARIOS",
        });
    } else {
      embed
        .setDescription("El usuario no se encuentra en ningún canal de voz")
        .setColor("#fb6444");
    }

    const row = new ActionRowBuilder<StringSelectMenuBuilder>
    const options = await import('../../stringMenu/mod/vcOptUr');
    await options.build(row, { disabled: disabled, author: interaction.customId.split(/:+/g)[1].split(/_+/g)[1].slice(1, interaction.customId.split(/:+/g)[1].length) }, [user.id])

    const boton = new ActionRowBuilder<ButtonBuilder>
    const module = await import('./vcRfUr');
    await module.build(boton, { disabled: false, author: interaction.customId.split(/:+/g)[1].split(/_+/g)[1].slice(1, interaction.customId.split(/:+/g)[1].length) }, [user.id])

    await interaction.update({ embeds: [embed], components: [row, boton] });
  }
}