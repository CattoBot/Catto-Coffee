import { InteractionHandler, InteractionHandlerTypes, PieceContext } from '@sapphire/framework';
import config from "../../../config"

import Client from "../../..";
import { Prisma } from "../../../client/PrismaClient";
import { container } from "@sapphire/framework";
import {
  ActionRowBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  ButtonInteraction,
  ButtonBuilder,
  ButtonStyle,
  GuildMember,
  User
} from "discord.js";

interface optionsObject {
  disabled: boolean | undefined,
  author: string | undefined,
}

export const build = async (actionRowBuilder: ActionRowBuilder, options: optionsObject, data: String[] | undefined) => {
  return new Promise(resolve => {
    actionRowBuilder.addComponents(
      new ButtonBuilder()
        .setCustomId(`mod:notePr_u${options.author}_${data?.join(",")}`)
        .setLabel(`Confirmar`)
        .setDisabled(options?.disabled)
        .setStyle(ButtonStyle.Success)
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
    if (cat == __dirname.split(/\\+/g)[__dirname.split(/\\+/g).length - 1] && `${id}.ts` == __filename.split(/\\+/g)[__filename.split(/\\+/g).length - 1]) {
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
    const userId = customIDsplitted[2].split(/,+/g)[0];

    const member = interaction.guild?.members.cache.get(`${userId}`) as GuildMember
    const miembro = interaction.member as GuildMember;
    const guildId = interaction.guild?.id

    if (!miembro.permissions.has(PermissionFlagsBits.ManageMessages))
      return interaction.update({
        embeds: [
          new EmbedBuilder()
            .setDescription("No tienes permisos para usar esta opción.")
            .setColor("#ed4245"),
        ],
        components: [],
      })

    const that_user_notes = await Prisma.userNotes.findMany({
      where: {
        UserID: `${userId}`,
        GuildID: `${guildId}`
      }
    })

    if (!that_user_notes || that_user_notes.length == 0)
      return await interaction.update({
        embeds: [
          new EmbedBuilder()
            .setDescription("El usuario no posee ninguna nota")
            .setColor("#ed4245")
        ],
        components: []
      })

    var permited = miembro.permissions.has(PermissionFlagsBits.ManageRoles)

    if (permited) {

      await Prisma.userNotes.deleteMany({
        where: {
          UserID: userId,
          GuildID: guildId
        }
      })

      const this_guild_config_channels = await Prisma.configChannels.findUnique({
        where: {
          GuildID: guildId
        }
      })

      if (
        this_guild_config_channels &&
        this_guild_config_channels.NotesLogs &&
        !isNaN(parseInt(this_guild_config_channels.NotesLogs))
      ) {

        const new_note_log = new EmbedBuilder()
          .setTimestamp()
          .setColor("#ed4245")
          .setAuthor({
            name: `${miembro.user.username}${miembro.user.discriminator && parseInt(miembro.user.discriminator) != 0 ? `#${miembro.user.discriminator}` : ""}`,
            iconURL: miembro.user.avatarURL() || "https://archive.org/download/discordprofilepictures/discordgrey.png"
          })
          .setDescription(
            `
          **Acción:** Limpiar notas
          **Usuario:** ${member.user.username}${member.user.discriminator && parseInt(member.user.discriminator) != 0 ? `#${member.user.discriminator}` : ""} (${userId})
          `
          )

        const notes_logs_channel: any = Client.channels.resolve(this_guild_config_channels.NotesLogs)
        notes_logs_channel
          .send({ embeds: [new_note_log] })
      }

      await interaction.update({
        embeds: [
          new EmbedBuilder()
            .setDescription("Notas limpiadas exitosamente.")
            .setColor("#2b2d31")
        ],
        components: []
      }).then((m) => {
        setTimeout(function () { try { m.delete().catch(() => { }) } catch { } }, 5000)
      })

      container.logger.info(`\x1b[32m${miembro.id}\x1b[0m ha eliminado todas las notas de \x1b[32m${userId}\x1b[0m en \x1b[36m${interaction.guild?.name} (${guildId})\x1b[0m`)

    } else {
      await interaction.update({
        embeds: [
          new EmbedBuilder()
            .setDescription("Parece ser que has perdido los permisos para limpiar estas notas.")
            .setColor("#ed4245")
        ], components: []
      })
    }
  }
}