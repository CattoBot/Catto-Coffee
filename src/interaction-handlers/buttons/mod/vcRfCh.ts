import { InteractionHandler, InteractionHandlerTypes, PieceContext } from '@sapphire/framework';
import config from "../../../config"
import emojis from '../../../utils/emojis/VoiceModEmojis/emojis';
import Client from "../../..";
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
        .setCustomId(`mod:vcRfCh_a${options.author}_${data?.join(",")}`)
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
          .setDescription(config.messages.interactionOwner.button)
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
    const channel = customIDsplitted[2].split(/,+/g)[0];


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

    var users: any[] = [];

    const canal: any = Client.channels.resolve(channel);
    if (canal && canal.type === 2) {
      const members = canal.members;
      members.forEach((user: any) => {
        users.push(
          `${user.voice.mute
            ? `${user.voice.serverMute ? emojis.serverMuted : emojis.selfMuted
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

    var disabled = false;
    if (users.length < 1) disabled = true;
    const row = new ActionRowBuilder<StringSelectMenuBuilder>
    const options = await import('../../stringMenu/mod/vcOptCh');
    await options.build(row, { disabled: disabled, author: interaction.customId.split(/:+/g)[1].split(/_+/g)[1].slice(1, interaction.customId.split(/:+/g)[1].length) }, [channel])
    const boton = new ActionRowBuilder<ButtonBuilder>
    const module = await import('./vcRfCh');
    await module.build(boton, { disabled: false, author: interaction.customId.split(/:+/g)[1].split(/_+/g)[1].slice(1, interaction.customId.split(/:+/g)[1].length) }, [channel])

    await interaction.update({ embeds: [embed], components: [row, boton] });
  }
}