import { InteractionHandler, InteractionHandlerTypes, PieceContext } from '@sapphire/framework';
import { Catto_Coffee } from '../../../App';
import { Database } from '../../../structures/Database';
import { Utils } from '../../../util/utils';
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
const { Messages } = Utils;
interface optionsObject {
  disabled: boolean | undefined,
  author: string | undefined,
}

export const build = async (actionRowBuilder: ActionRowBuilder, options: optionsObject, data: String[] | undefined) => {
  return new Promise(resolve => {
    actionRowBuilder.addComponents(
      new ButtonBuilder()
        .setCustomId(`mod:noteRm_u${options.author}_${data?.join(",")}`)
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

  public async run(interaction: ButtonInteraction) {
    const customIDsplitted = interaction.customId.split(/_+/g);
    const noteId = customIDsplitted[2].split(/,+/g)[0];


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

    const note = await Database.userNotes.findUnique({
      where: {
        NoteID_GuildID: {
          NoteID: parseInt(noteId),
          GuildID: `${guildId}`
        }
      }
    })

    if (!note || note?.NoteID != parseInt(noteId))
      return await interaction.update({
        embeds: [
          new EmbedBuilder()
            .setDescription("No se encontró la nota")
            .setColor("#ed4245")
        ], components: []
      })

    const note_perpetrator = await Catto_Coffee.users.fetch(note.Perpetrator) as User;
    var permited = note_perpetrator.id == miembro.id || miembro.permissions.has(PermissionFlagsBits.ManageGuild)

    if (permited) {

      await Database.userNotes.delete({
        where: {
          NoteID_GuildID: {
            NoteID: parseInt(noteId),
            GuildID: `${guildId}`
          }
        }
      })

      const this_guild_config_channels = await Database.configChannels.findUnique({
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
          **Acción:** Eliminar nota
          `
          )
          .setFooter({ text: `Nota #${noteId}` })

        const notes_logs_channel: any = Catto_Coffee.channels.resolve(this_guild_config_channels.NotesLogs)
        notes_logs_channel
          .send({ embeds: [new_note_log] })
      }

      await interaction.update({
        embeds: [
          new EmbedBuilder()
            .setDescription("Nota eliminada exitosamente.")
            .setColor("#2b2d31")
        ],
        components: []
      }).then((m) => {
        setTimeout(function () { try { m.delete().catch(() => { }) } catch { } }, 5000)
      })

      container.logger.info(`\x1b[32m${miembro.id}\x1b[0m ha eliminado la \x1b[33mNOTA#${noteId}\x1b[0m en \x1b[36m${interaction.guild?.name} (${guildId})\x1b[0m`)

    } else {
      await interaction.update({
        embeds: [
          new EmbedBuilder()
            .setDescription("Parece ser que has perdido los permisos para eliminar esta nota.")
            .setColor("#ed4245")
        ], components: []
      })
    }
  }
}